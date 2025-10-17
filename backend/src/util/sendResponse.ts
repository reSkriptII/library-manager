import { Response } from "express";

function sendResponse(res: Response, isSuccess: true, data?: unknown): Response;
function sendResponse(
  res: Response,
  isSuccess: false,
  statusCode: number,
  message: string
): Response;
function sendResponse(
  res: Response,
  isSuccess: boolean,
  statuscodeOrData?: unknown,
  message?: string | undefined
): Response {
  if (isSuccess) {
    return res.status(200).json({
      status: "success",
      data: statuscodeOrData,
    });
  }

  if (typeof statuscodeOrData !== "number")
    throw new TypeError("Status code is not a number");
  return res.status(statuscodeOrData).json({
    status: "fail",
    message: message,
  });
}

export { sendResponse };
