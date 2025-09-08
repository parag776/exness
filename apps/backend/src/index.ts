import express, { type NextFunction, type Request, type Response } from "express";
import cookieParser from "cookie-parser"
import {Resend} from "resend";
import crypto from "crypto"
import {redis} from "@repo/cache"
import {prisma} from "@repo/database"
import jwt from "jsonwebtoken"
import type {TradeCreate} from "@repo/types"

import "dotenv/config";

interface CustomRequest extends Request {
    email?: string
}

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res)=>{
    res.send("welcome to exness.")
})

const resend = new Resend(process.env.RESEND_API_KEY);
const frontend_url = process.env.FRONTEND_URL ?? "http://localhost:3000";
const authSecret = process.env.AUTH_SECRET ?? "notagoodjwtsecret";

app.post("/api/v1/signup", async (req, res)=>{

    try{
        const email = req.body.email as string
        
        const token = crypto.randomBytes(32).toString("hex");
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "verification link",
            html: `
                <p>Click the link below to verify your email:</p>
                <a href="${frontend_url}/api/v1/signin/post?token=${token}">Verify Email</a>
            `,
        });

        redis.set(token, email);
        res.json({});
    } catch(e){
        res.json({err: "please enter a valid email"})
    }
});

app.post("/api/v1/signin", async (req, res)=>{

    try{
        const email = req.body.email as string
        
        const token = crypto.randomBytes(32).toString("hex");
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "verification link",
            html: `
                <p>Click the link below to verify your email:</p>
                <a href="${frontend_url}/api/v1/signin/post?token=${token}">Verify Email</a>
            `,
        });

        redis.set(token, email);
        res.json({});
    } catch(e){
        res.json({err: "please enter a valid email"})
    }
});

app.get("/api/v1/signin/post", async (req, res)=>{
    try{
        const token = req.query.token as string;
        const email = await redis.get(token);
        
        if(!email){
            return res.json({err: "email verification failed"})
        }
        prisma.user.upsert({
            where: {
                email,
            },
            update: {
                lastLoggedIn: new Date(Date.now()),
            },
            create: {
                email,
                lastLoggedIn: new Date(Date.now()),
            }
        })
        res.cookie("auth", jwt.sign({email}, authSecret));
        res.redirect("/");
    } catch(e){
        res.redirect("/")
    }
});

const auth = (req: CustomRequest, res: Response, next: NextFunction) =>{
    try{
        const token = req.cookies.auth;
        const {email} = jwt.verify(token, authSecret) as jwt.JwtPayload;
        req.email = email;
        next();
    } catch(e){
        res.json({err: "authentication failed"})
    }
}

app.post("/api/v1/trade/create", auth, (req: CustomRequest, res)=>{
    try {

        const trade: TradeCreate = req.body;

    } catch(e){
        res.json({err: ""})
    }
    res.json({})
})

app.listen(3000, ()=>{
    console.log("express backend is running on port 3000")
})