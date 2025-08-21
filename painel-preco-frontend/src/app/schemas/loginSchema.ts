import * as yup from "yup";
import yupStrings from "@/utils/yupStrings";

export const schema = yup.object({
  login: yup.string().required(yupStrings.required),
  password: yup.string().required(yupStrings.required),
});
export type FormData = yup.InferType<typeof schema>;