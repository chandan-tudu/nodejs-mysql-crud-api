import { insertPostSchema, updatePostSchema } from "./validations.js";
import dbConnection from "./database.js";

const resJson = (res, status, message, extra = {}) => {
    return res.status(status).json({
        status,
        message,
        ...extra,
    });
};

export const insertPost = async (req, res, next) => {
    try {
        const postData = insertPostSchema.safeParse(req.body);
        if (!postData.success) {
            return resJson(res, 422, "Please fill in all fields correctly.", {
                fieldErrors: postData.error.flatten().fieldErrors,
            });
        }

        const { title, content, author } = postData.data;

        const [result] = await dbConnection.execute(
            "INSERT INTO `posts` (`title`,`content`,`author`) VALUES (?,?,?)",
            [title, content, author]
        );

        resJson(res, 201, "Post has been created successfully", {
            post_id: result.insertId,
        });
    } catch (err) {
        next(err);
    }
};

export const readPost = async (req, res, next) => {
    try {
        let sql = "SELECT * FROM `posts`";
        const haspostId = req.params.post_id || false;

        if (haspostId) {
            const parsedpostId = parseInt(haspostId);

            if (isNaN(haspostId) || parsedpostId <= 0) {
                return resJson(
                    res,
                    422,
                    "Post id must be a number and greater than the 0."
                );
            }

            sql = `SELECT * FROM posts WHERE id=${parsedpostId}`;
        }

        const [row] = await dbConnection.query(sql);

        if (row.length === 0 && haspostId) {
            return resJson(res, 404, "Incorrect post ID. Post not found.");
        }

        const posts = haspostId ? { post: row[0] } : { posts: row };
        const message = haspostId ? "Single Post" : "All Post";

        resJson(res, 200, message, posts);
    } catch (err) {
        next(err);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.post_id;
        const parsedpostId = parseInt(postId);
        if (isNaN(postId) || parsedpostId <= 0) {
            return resJson(
                res,
                422,
                "Post id must be a number and greater than the 0."
            );
        }

        const postData = updatePostSchema.safeParse(req.body);

        if (!postData.success) {
            return resJson(res, 422, "Please fill in all fields correctly.", {
                fieldErrors: postData.error.flatten().fieldErrors,
            });
        }

        const [row] = await dbConnection.query(
            "SELECT * FROM `posts` WHERE `id`=?",
            [parsedpostId]
        );
        if (row.length !== 1) {
            return resJson(res, 404, "Incorrect post id. Post not foundl");
        }
        const newPostData = postData.data;
        const post = row[0];
        const updatedDate = new Date().toISOString();
        const title = newPostData.title || post.title;
        const content = newPostData.content || post.content;

        const updateSQLTemp =
            "UPDATE `posts` SET `title`=?, `content`=?, `updated_at`=? WHERE `id`=?";

        await dbConnection.execute(updateSQLTemp, [
            title,
            content,
            updatedDate,
            parsedpostId,
        ]);

        resJson(res, 200, "Post Updated Successfully", {
            post_id: parsedpostId,
        });
    } catch (err) {
        next(err);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const postId = req.body.post_id;
        const parsedpostId = parseInt(postId);
        if (isNaN(postId) || parsedpostId <= 0) {
            return resJson(
                res,
                422,
                "Post id must be a number and greater than the 0.",
                {
                    fieldErrors: {
                        post_id: [
                            "Required and must be a number and greater than the 0.",
                        ],
                    },
                }
            );
        }

        const [result] = await dbConnection.execute(
            "DELETE FROM `posts` WHERE `id`=?",
            [parsedpostId]
        );

        if (result.affectedRows) {
            return resJson(res, 200, "Post has been deleted successfully.");
        }
        return resJson(res, 404, "Incorrect post id. Post not found.");
    } catch (e) {
        next(e);
    }
};

export default {
    insertPost,
    readPost,
    updatePost,
    deletePost,
};
