import cloudinary from "../config/cloud.config.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
    }

        const { filename } = req.body;
    if (!filename) {
            return res.status(400).json({
                success: false,
                message: "Filename is required",
            });
    }

    const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "files",
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result);
                }
            );

            stream.end(req.file.buffer);
        });

        const file = await File.create({
            filename,
            fileurl: result.secure_url,
            createdAt: req.user._id,
        });

        await user.finalldByIdAndUpdate(req.user._id, {
            $push: { files: file._id },
        });

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            file,
        });
    } catch (error) {
    console.error("file upload error:", error, message );
        return res.status(500).json({
            success: false,
            message: "Internal server error",
    });
  }
};