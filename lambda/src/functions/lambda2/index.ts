import { hoge } from "../../lib/common";

export const main = async () => {
    try {
        const x = hoge(10);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'hello world' + x,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};