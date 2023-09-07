import Photo from "../models/photoModel.js";
import fs from "fs";

  // Modify a user's photo by user ID
  export const modifyPhotoByUserId = async (req, res) => {
    try {
      const userId = req.params.pid;
      const { image } = req.files;
      if(!image){
        return res.status(400).send({ error: "Photo is Required" });
        }
        if(image.size > 1000000){
            return res.status(400).send({ error: "Photo should be less than 1mb" });
        }

        // Delete the existing photo, if it exists
        await Photo.findOneAndDelete({ user: userId });
  
      // Upload a new photo
      const photo = new Photo({
        user: userId,
      });

      photo.image.data = fs.readFileSync(image.path);
      photo.image.contentType = image.type;
      await photo.save();
  
      res.status(201).send({ success: true, message: 'User photo modified successfully', photo });
    } catch (error) {
      // console.error(error);
      res.status(500).send({
        success: false,
        message: 'Error while modifying user photo',
        error: error.message,
      });
    }
  };

export const createPhoto = async(req, res) => {
    try{
        const userId = req.params.pid;

        const { image } = req.files;
        // Delete the existing photo, if it exists
        await Photo.findOneAndDelete({ user: userId });
        if(!image){
            return res.status(400).send({ error: "Photo is Required" });
        }
        if(image.size > 1000000){
            return res.status(400).send({ error: "Photo should be less than 1mb" });
        }
        const photo = new Photo({
            user: userId,
        });
        photo.image.data = fs.readFileSync(image.path);
        photo.image.contentType = image.type;
        await photo.save();
        res.status(201).send({success:true, message: 'Photo uploaded successfully',photo });
    }catch(error){
        // console.log(error);
        res.status(500).send({
        success: false,
        error,
        message: "Error in creating user photo",
        });
    }
};

export const getPhotoByUserId = async (req, res) => {
    try {
      const userId = req.params.pid;
  
      // Find the user's photo by user ID
      const photo = await Photo.findOne({ user: userId });
  
      if (!photo) {
        return res.status(404).send({ success: false, message: 'User photo not found' });
      }
  
      // Set the appropriate content type based on the photo's contentType field
      res.set('Content-Type', photo.image.contentType);
  
      // Send the photo data as the response
      res.status(200).send(photo.image.data);
    } catch (error) {
      // console.error(error);
      res.status(500).send({
        success: false,
        message: 'Error while getting user photo',
        error: error.message,
      });
    }
  };

  // Delete a user's photo by user ID
export const deletePhotoByUserId = async (req, res) => {
    try {
      const userId = req.params.pid;
  
      // Find and delete the user's photo by user ID
      const photo = await Photo.findOneAndDelete({ user: userId });
  
      if (!photo) {
        return res.status(404).send({ success: false, message: 'User photo not found' });
      }
  
      res.status(200).send({ success: true, message: 'User photo deleted successfully' });
    } catch (error) {
      // console.error(error);
      res.status(500).send({
        success: false,
        message: 'Error while deleting user photo',
        error: error.message,
      });
    }
  };

