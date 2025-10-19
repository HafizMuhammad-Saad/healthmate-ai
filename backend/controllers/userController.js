const fs = require('fs');
const path = require('path');
const User = require('../models/User');

// @desc update uour profile {name , avatar, company details}
exports.updateProfile = async (req, res) => {
    try {
        const { name, avatar, companyName, companyDescription, companyLogo, resume } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.resume = resume || user.resume;

        //if employer, updating company info
        if (user.role === "employer") {
            user.companyName = companyName || user.companyName;
            user.companyDescription = companyDescription || user.companyDescription;
            user.companyLogo = companyLogo || user.companyLogo;
        }

        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            companyName: user.companyName,
            companyDescription: user.companyDescription,
            companyLogo: user.companyLogo,
            resume: user.resume || ""
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc delete resume
exports.deleteResume = async (req, res) => {
    try {
        const {resumeUrl} = req.body;

        const fileName = resumeUrl?.split("/").pop();

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role === "jobseeker") {
            return res.status(403).json({ message: "Only jobseeker can delete resumes" });
        }

        const filePath = path.join(__dirname, "../uploads", fileName);

        //check if the file exists and then delete
        if (fs.existsSync(filePath))  {
            fs.unlinkSync(filePath); //delete the file
        }
        
        //set the user resume to an empty string
        user.resume = "";
        await user.save();
        res.json({ message: "Resume deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
};

// @desc get public profile
exports.getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};