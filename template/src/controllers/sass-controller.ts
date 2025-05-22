import { Request, Response } from "express";

export class SassController {
 static async getAll(req: Request, res: Response) {
    res.status(200).json({ message: "Listing all resources" });
  }

 static async getOne(req: Request, res: Response) {
    res.status(200).json({ message: "Showing single resource" });
  }

 static async create(req: Request, res: Response) {
    res.status(201).json({ message: "Resource created" });
  }

 static async update(req: Request, res: Response) {
    res.status(200).json({ message: "Resource updated" });
  }

 static async delete(req: Request, res: Response) {
    res.status(200).json({ message: "Resource deleted" });
  }

}
