const client = require('../client');

const contracts = {
    readAll: async() => {
        return (await client.query(`SELECT posts.id, posts."userId", contracts."companyId", posts.title, contracts."contractStatus", contracts.contract FROM posts, contracts WHERE posts.id = contracts."postId"`)).rows;
    },
    create: async({ userId, companyId, postId, contract, contractStatus }) => {

        const SQL =`INSERT INTO contracts ("userId", "companyId", "postId", contract, "contractStatus") values ($1, $2, $3, $4, $5) RETURNING *`;

        return (await client.query(SQL, [ userId, companyId, postId, contract, contractStatus ])).rows[0];
    }
}

module.exports = contracts;