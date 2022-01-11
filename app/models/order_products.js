const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_products', {
    orderid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'orders',
        key: 'orderid'
      }
    },
    productid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'products',
        key: 'productid'
      }
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    ispurchase: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'order_products',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "orders_products_pkey",
        unique: true,
        fields: [
          { name: "orderid" },
          { name: "productid" },
          { name: "size" },
        ]
      },
    ]
  });
};
