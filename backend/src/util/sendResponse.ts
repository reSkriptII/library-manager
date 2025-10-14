import { Response } from "express";

function sendResponse(res: Response, isSuccess: true, data?: any): Response;
function sendResponse(
  res: Response,
  isSuccess: false,
  statusCode: number,
  message: string
): Response;
function sendResponse(
  res: Response,
  isSuccess: boolean,
  statuscodeOrData?: any,
  message?: string | undefined
): Response {
  if (isSuccess) {
    return res.status(200).json({
      status: "success",
      data: statuscodeOrData,
    });
  }

  return res.status(statuscodeOrData).json({
    status: "fail",
    message: message,
  });
}

export { sendResponse };
