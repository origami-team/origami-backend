const upload = require("../middleware/upload");

const uploadFile = async (req, res) => {
  try {
    await upload(req, res)


    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }

    console.log(req)

    res.setHeader('Content-Type', 'application/json');
    return res.json({
      message: "File has been uploaded.",
      filename: req.file.filename
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
};

module.exports = {
  uploadFile: uploadFile
};