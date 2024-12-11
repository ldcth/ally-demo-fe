import instance from "./axios";

const getChatAnswer = (data: { content: string }) => {
  return instance.post("/answer", data);
};
const getIntentAnswer = (data: { content: string }) => {
  return instance.post("/intent", data);
};
export const ModelApi = {
  getChatAnswer,
  getIntentAnswer,
};
