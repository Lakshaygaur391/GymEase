const Members_Modal = require('../Models/Members');
const membership_modal = require('../Models/membership');

exports.addMember = async (req, res) => {
    try {
        const { Name, Phone_Number, Mobile_No, Address, Date: joiningDateStr, membership, ProfilePic } = req.body;
        const phone = Phone_Number || Mobile_No;

        if (!Name || !phone || !Address || !membership) {
            return res.status(400).json({ Message: "Name, Mobile Number, Address, and Membership plan are required" });
        }

        const membershipPlan = await membership_modal.findById(membership);
        if (!membershipPlan) {
            return res.status(404).json({ Message: "Membership plan not found" });
        }

        const startDate = joiningDateStr ? new Date(joiningDateStr) : new Date();
        const nextDueDate = new Date(startDate);
        nextDueDate.setMonth(nextDueDate.getMonth() + membershipPlan.No_of_Months);

        const newMember = new Members_Modal({
            Name,
            Phone_Number: Number(phone),
            Address,
            membership: membershipPlan._id,
            gym: req.gymId,
            status: 'active',
            lastPaymentDate: startDate,
            nextPaymentDueDate: nextDueDate,
            ProfilePic: ProfilePic || "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
        });

        await newMember.save();
        return res.status(201).json({ Message: "Member added successfully", success: true, member: newMember });
    } catch (err) {
        console.error("Add Member Error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.getMembers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        let query = { gym: req.gymId };

        if (search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            const isNumber = !isNaN(search.trim());
            
            if (isNumber) {
                query.$or = [
                    { Name: searchRegex },
                    { Phone_Number: Number(search.trim()) }
                ];
            } else {
                query.Name = searchRegex;
            }
        }

        const totalMembers = await Members_Modal.countDocuments(query);
        const members = await Members_Modal.find(query)
            .populate('membership')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalMembers / limit) || 1;

        return res.status(200).json({
            success: true,
            members,
            totalMembers,
            totalPages,
            currentPage: page
        });
    } catch (err) {
        console.error("Get Members Error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.getMemberById = async (req, res) => {
    try {
        const member = await Members_Modal.findOne({ _id: req.params.id, gym: req.gymId }).populate('membership');
        if (!member) {
            return res.status(404).json({ Message: "Member not found" });
        }
        return res.status(200).json({ success: true, member });
    } catch (err) {
        console.error("Get Member By Id Error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.updateMemberStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const member = await Members_Modal.findOne({ _id: req.params.id, gym: req.gymId });
        if (!member) {
            return res.status(404).json({ Message: "Member not found" });
        }

        member.status = status || (member.status === 'active' ? 'inactive' : 'active');
        await member.save();

        return res.status(200).json({ Message: "Member status updated", success: true, member });
    } catch (err) {
        console.error("Update Status Error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.renewMembership = async (req, res) => {
    try {
        const { membershipId } = req.body;
        if (!membershipId) {
            return res.status(400).json({ Message: "Membership ID is required for renewal" });
        }

        const member = await Members_Modal.findOne({ _id: req.params.id, gym: req.gymId });
        if (!member) {
            return res.status(404).json({ Message: "Member not found" });
        }

        const membershipPlan = await membership_modal.findById(membershipId);
        if (!membershipPlan) {
            return res.status(404).json({ Message: "Membership plan not found" });
        }

        const now = new Date();
        const baseDate = member.nextPaymentDueDate > now ? member.nextPaymentDueDate : now;
        const newDueDate = new Date(baseDate);
        newDueDate.setMonth(newDueDate.getMonth() + membershipPlan.No_of_Months);

        member.membership = membershipPlan._id;
        member.lastPaymentDate = now;
        member.nextPaymentDueDate = newDueDate;
        member.status = 'active';

        await member.save();
        return res.status(200).json({ Message: "Membership renewed successfully", success: true, member });
    } catch (err) {
        console.error("Renew Membership Error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.getSpecificMembers = async (req, res) => {
    try {
        const { category } = req.params;
        const now = new Date();
        let query = { gym: req.gymId };

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const threeDaysLater = new Date(now);
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);

        const fourDaysLater = new Date(now);
        fourDaysLater.setDate(fourDaysLater.getDate() + 4);

        const sevenDaysLater = new Date(now);
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

        switch (category) {
            case "Joined-Members":
                // All members for this gym
                break;
            case "Monthly-joined":
                query.createdAt = { $gte: startOfMonth };
                break;
            case "expire-within-3days":
                query.status = 'active';
                query.nextPaymentDueDate = { $gte: now, $lte: threeDaysLater };
                break;
            case "Expire-within-4to7-days":
                query.status = 'active';
                query.nextPaymentDueDate = { $gt: threeDaysLater, $lte: sevenDaysLater };
                break;
            case "expired":
                query.status = 'active';
                query.nextPaymentDueDate = { $lt: now };
                break;
            case "Inactive-members":
                query.status = 'inactive';
                break;
            default:
                break;
        }

        const members = await Members_Modal.find(query).populate('membership').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, members });
    } catch (err) {
        console.error("Get Specific Members Error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const threeDaysLater = new Date(now);
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);

        const sevenDaysLater = new Date(now);
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

        const totalJoined = await Members_Modal.countDocuments({ gym: req.gymId });
        const monthlyJoined = await Members_Modal.countDocuments({ gym: req.gymId, createdAt: { $gte: startOfMonth } });
        const expireIn3Days = await Members_Modal.countDocuments({ gym: req.gymId, status: 'active', nextPaymentDueDate: { $gte: now, $lte: threeDaysLater } });
        const expireIn4To7Days = await Members_Modal.countDocuments({ gym: req.gymId, status: 'active', nextPaymentDueDate: { $gt: threeDaysLater, $lte: sevenDaysLater } });
        const expired = await Members_Modal.countDocuments({ gym: req.gymId, status: 'active', nextPaymentDueDate: { $lt: now } });
        const inactive = await Members_Modal.countDocuments({ gym: req.gymId, status: 'inactive' });

        return res.status(200).json({
            success: true,
            stats: {
                totalJoined,
                monthlyJoined,
                expireIn3Days,
                expireIn4To7Days,
                expired,
                inactive
            }
        });
    } catch (err) {
        console.error("Get Dashboard Stats Error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};
