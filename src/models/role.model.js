const { query } = require('../db/db-connection');
const { multipleColumnSet, multipleFilterSet } = require('../utils/common.utils');
const { tables } = require('../utils/tableNames.utils');
class RoleModel {

    findAll = async (params = {}) => {
        let sql = `SELECT * FROM ${tables.Roles}
        NATURAL JOIN ${tables.MovieRoles}
        NATURAL JOIN ${tables.Movies}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { filterSet, filterValues } = multipleFilterSet(params);
        sql += ` WHERE ${filterSet}`;

        return await query(sql, [...filterValues]);
    }

    findOne = async (params) => {
        const { filterSet, filterValues } = multipleFilterSet(params);

        const sql = `SELECT * FROM ${tables.Roles}
        NATURAL JOIN ${tables.MovieRoles}
        NATURAL JOIN ${tables.Movies}
        WHERE ${filterSet}
        GROUP BY movie_id`;

        const result = await query(sql, [...filterValues]);

        return result;
    }

    create = async ({ full_name, age, picture_url }) => {
        const sql = `INSERT INTO ${tables.Roles}
        (full_name, age, picture_url) 
        VALUES (?,?,?)`;

        const result = await query(sql, [full_name, age, picture_url]);
        const created_role = !result ? 0 : {
            role_id: result.insertId,
            affected_rows: result.affectedRows
        };

        return created_role;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params);

        const sql = `UPDATE ${tables.Roles} SET ${columnSet} WHERE role_id = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${tables.Roles}
        WHERE role_id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new RoleModel;