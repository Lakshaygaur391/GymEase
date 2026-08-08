const membership_modal = require('../Models/membership');

exports.addMembership = async (req, res) => {
    try {
        const { No_of_Months, Price } = req.body;
        if (!No_of_Months || !Price) {
            return res.status(400).json({ Message: "No_of_Months and Price are required" });
        }

        const newMembership = new membership_modal({
            No_of_Months: Number(No_of_Months),
            Price: Number(Price),
            gym: req.gymId
        });

        await newMembership.save();
        return res.status(201).json({ Message: "Membership plan added successfully", success: true, membership: newMembership });
    } catch (err) {
        console.error("Add Membership Error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.getMemberships = async (req, res) => {
    try {
        const memberships = await membership_modal.find({ gym: req.gymId }).sort({ No_of_Months: 1 });
        return res.status(200).json({ success: true, memberships });
    } catch (err) {
        console.error("Get Memberships Error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};
