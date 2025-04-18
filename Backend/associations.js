const courseRegistration = require("./models/courseRegistration");
const Fields = require("./models/fields");
const Region = require("./models/region");
const User = require("./models/user");
const Resource = require("./models/resources");
const Category = require("./models/category");
const Branch = require("./models/branch");
const EduCenter = require("./models/edCenter");
const EduCenter_Subject = require("./models/educenterSubject");
const EduCenter_Field = require("./models/educenterField");
const Subjet = require("./models/subject");
const Like = require("./models/likes");
const Comment = require("./models/comment");

User.hasMany(courseRegistration, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
courseRegistration.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Region.hasMany(User, {
  foreignKey: "region_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.belongsTo(Region, {
  foreignKey: "region_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(Resource, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Resource.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Category.hasMany(Resource, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Resource.belongsTo(Category, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

EduCenter.hasMany(Branch, {
  foreignKey: "edu_id",
  as: "eduCenter",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Branch.belongsTo(EduCenter, {
  foreignKey: "edu_id",
  as: "eduCenter",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Region.hasMany(Branch, {
  foreignKey: "region_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Branch.belongsTo(Region, {
  foreignKey: "region_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

EduCenter.belongsToMany(Subjet, {
  through: EduCenter_Subject,
  foreignKey: "edu_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Subjet.belongsToMany(EduCenter, {
  through: EduCenter_Subject,
  foreignKey: "subject_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

EduCenter.belongsToMany(Fields, {
  through: EduCenter_Field,
  foreignKey: "edu_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Fields.belongsToMany(EduCenter, {
  through: EduCenter_Field,
  foreignKey: "field_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

EduCenter.hasMany(EduCenter_Subject, {
  foreignKey: "edu_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EduCenter_Subject.belongsTo(EduCenter, {
  foreignKey: "edu_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Subjet.hasMany(EduCenter_Subject, {
  foreignKey: "subject_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EduCenter_Subject.belongsTo(Subjet, {
  foreignKey: "subject_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

EduCenter.hasMany(EduCenter_Field, {
  foreignKey: "edu_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EduCenter_Field.belongsTo(EduCenter, {
  foreignKey: "edu_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Fields.hasMany(EduCenter_Field, {
  foreignKey: "field_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EduCenter_Field.belongsTo(Fields, {
  foreignKey: "field_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(Like, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Like.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

EduCenter.hasMany(Like, {
  foreignKey: "edu_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Like.belongsTo(EduCenter, {
  foreignKey: "edu_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
  as: "comments",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Comment.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

EduCenter.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(EduCenter, {
  foreignKey: "user_id",
  as: "eduCenters",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

EduCenter.belongsTo(Region, {
  foreignKey: "region_id",
  as: "region",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Region.hasMany(EduCenter, {
  foreignKey: "region_id",
  as: "eduCenters",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

courseRegistration.belongsTo(Branch, {
  foreignKey: "branch_id",
  as: "branch",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Branch.hasMany(courseRegistration, {
  foreignKey: "branch_id",
  as: "registrations",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Comment.belongsTo(EduCenter, {
  foreignKey: "edu_id",
  as: "eduCenter",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EduCenter.hasMany(Comment, {
  foreignKey: "edu_id",
  as: "comments",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Branch.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Branch, {
  foreignKey: "user_id",
  as: "Branchs",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

EduCenter.belongsToMany(Subjet, {
  through: EduCenter_Subject,
  foreignKey: "edu_id",
  as: "subjects",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Subjet.belongsToMany(EduCenter, {
  through: EduCenter_Subject,
  foreignKey: "subject_id",
  as: "eduCenters",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

EduCenter.belongsToMany(Fields, {
  through: EduCenter_Field,
  foreignKey: "edu_id",
  as: "fields",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Fields.belongsToMany(EduCenter, {
  through: EduCenter_Field,
  foreignKey: "field_id",
  as: "eduCenters",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = {
  courseRegistration,
  Fields,
  Region,
  User,
  Category,
  Resource,
  Branch,
  EduCenter,
  EduCenter_Subject,
  EduCenter_Field,
  Subjet,
  Like,
  Comment,
};
