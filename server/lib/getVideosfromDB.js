import { videoModel } from "../models/video.model.js";
export const getVideosFromMongo = async (ids) => {
    return await videoModel.find({ youtubeId: { $in: ids } });
};
