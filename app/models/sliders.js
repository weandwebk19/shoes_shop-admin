const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sliders', {
    sliderid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    title: {
      type: DataTypes.CHAR(2048),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'sliders',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sliders_pkey",
        unique: true,
        fields: [
          { name: "sliderid" },
        ]
      },
    ]
  });
};
