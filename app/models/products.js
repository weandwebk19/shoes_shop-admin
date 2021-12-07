const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    productid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    productname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true
    },
    branch: {
      type: DataTypes.STRING(2048),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'products',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "products_pkey",
        unique: true,
        fields: [
          { name: "productid" },
        ]
      },
    ]
  });
};
