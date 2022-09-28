import { DataTypes } from 'sequelize';

export function defineTable(sequelize) {
    const Request = sequelize.define('request', {    
        request_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        service_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        service_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        consumer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gateway: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        proxy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        request: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });

    return Request;
}
