const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('feedbacks', {
    feedbackid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    customer_name: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(2048),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(2048),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(1024),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'feedbacks',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "feedbacks_pkey",
        unique: true,
        fields: [
          { name: "feedbackid" },
        ]
      },
    ]
  });
};
