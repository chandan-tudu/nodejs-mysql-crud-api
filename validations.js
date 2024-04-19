import { z } from "zod";
import validator from "validator";
const { unescape, escape } = validator;

export const insertPostSchema = z
    .object({
        title: z.string().trim().min(10),
        content: z.string().trim().min(10),
        author: z.string().min(3),
    })
    .transform((data) => {
        return {
            ...data,
            title: escape(unescape(data.title)),
            content: escape(unescape(data.content)),
            author: escape(unescape(data.author)),
        };
    });

export const updatePostSchema = z.object({
    title: z
        .string()
        .trim()
        .min(10)
        .transform((val) => escape(unescape(val)))
        .optional(),
    content: z
        .string()
        .trim()
        .min(10)
        .transform((val) => escape(unescape(val)))
        .optional(),
});
