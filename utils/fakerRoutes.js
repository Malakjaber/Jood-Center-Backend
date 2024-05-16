const { faker } = require("@faker-js/faker");
const { sequelize } = require("../models");

const generateRandomData = () => {
  const randomStudent = () => ({
    st_id: faker.helpers.replaceSymbols("##########"),
    name: faker.person.fullName(),
    birth_date: faker.date.anytime(),
    pathological_case: faker.string.alpha(10),
    phone: faker.helpers.replaceSymbols("##########"),
    address: faker.lorem.words({ min: 3, max: 6 }),
    medicines: faker.lorem.words({ min: 3, max: 6 }),
    class_id: faker.number.int({ min: 1, max: 6 }),
    parent_id: "420059917",
  });
  const randomTeacher = () => ({
    teacher_id: faker.helpers.replaceSymbols("##########"),
    username: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    // address: faker.lorem.words({ min: 3, max: 6 }),
  });
  return { randomStudent, randomTeacher };
};

const fillStudentsTable = async (req, res) => {
  const { randomStudent } = generateRandomData();
  for (let i = 0; i < 30; i++) {
    await sequelize.models.student.create(randomStudent());
    console.log("============> Iteration: " + i + " <=============");
  }
  res.json({ message: "success" });
};

const fillClassesTable = async (req, res) => {
  const classesNames = [
    "Autism (A)",
    "Autism (B)",
    "Difficulty Of Learning (A)",
    "Difficulty Of Learning (B)",
    "Difficulty Of Speech (A)",
    "Difficulty Of Speech (B)",
  ];
  for (let i = 0; i < 6; i++) {
    await sequelize.models.class.create({ name: classesNames[i] });
    console.log("============> Iteration: " + i + " <=============");
  }
  res.json({ message: "success" });
};

const fillTeachersTable = async (req, res) => {
  const { randomTeacher } = generateRandomData();
  for (let i = 0; i < 30; i++) {
    await sequelize.models.teacher.create(randomTeacher());
    console.log("============> Iteration: " + i + " <=============");
  }
  res.json({ message: "success" });
};

module.exports = { fillStudentsTable, fillTeachersTable, fillClassesTable };
