const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wishlist', {
    wishlistid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    customerid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'customerid'
      }
    }
  }, {
    sequelize,
    tableName: 'wishlist',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "wishlist_pkey",
        unique: true,
        fields: [
          { name: "wishlistid" },
        ]
      },
    ]
  });
};
