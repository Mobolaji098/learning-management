import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import * as dynamoose from "dynamoose";
import serverless from "serverless-http";
import {
    clerkMiddleware,
    createClerkClient,
    requireAuth,
} from "@clerk/express";

/* ROUTE IMPORTS */
import courseRoutes from "./routes/courseRoutes";
import userClerkRoutes from "./routes/userClerkRoutes";
import transactionRoutes from "./routes/ transactionRoutes";
import userCourseProgressRoutes from "./routes/userCourseProgressRoutes";
import seed from "./seed/seedDynamodb";




    /* CONFIGURATIONS */

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
if(!isProduction) {
    dynamoose.aws.ddb.local()
}

export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});


const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

/* ROUTE */
app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
})

app.use("/courses",courseRoutes)
app.use("/transactions", requireAuth(), transactionRoutes);
app.use("/users/clerk", requireAuth(), userClerkRoutes);
app.use("/users/course-progress", requireAuth(), userCourseProgressRoutes);

/* SERVER */
const port = process.env.PORT || 3000;

if(!isProduction) {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
}

// aws production environment
const serverlessApp = serverless(app);
export const handler = async (event: any, context: any) => {
    if (event.action === "seed") {
        await seed();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Data seeded successfully" }),
        };
    } else {
        return serverlessApp(event, context);
    }
};