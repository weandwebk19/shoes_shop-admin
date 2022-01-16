const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wishlist_products', {
    wishlistid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      references: {
        model: 'wishlist',
        key: 'wishlistid'
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
    }
  }, {
    sequelize,
    tableName: 'wishlist_products',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "wishlist_products_pkey",
        unique: true,
        fields: [
          { name: "wishlistid" },
          { name: "productid" },
        ]
      },
    ]
  });
};
