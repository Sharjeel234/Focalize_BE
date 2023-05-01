import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import user from "../models/user"

export const signUp = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    try {
        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User Already Exist..!" });
        }

        if (password!==confirmPassword) {
            return res.status(400).json({ message: "Password Should Match..!" })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await user.create({ email, password:hashedPassword, name: `${firstName} ${lastName}` });

        const token = jwt.sign({ email:result.email, id:result._id }, 'secret', { expiresIn: '5h' });

        res.status(200).json({ result, token });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong!! Please Try Again" });
    }
}

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User Does Not Exist!" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Password Invalid, Try Again!" });
        }

        const token = jwt.sign({ email:existingUser.email, id:existingUser._id }, 'secret', { expiresIn: '5h' });

        res.status(200).json({ result:existingUser, token });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong!! Please Try Again" });
    }
}