import process from "node:process";
import { expect, test } from "@playwright/test";

const appUrl =
  process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173";
const skillName = process.env.SKILL_NAME;
const proficiencyLevel =
  process.env.PROFICIENCY_LEVEL || "Basic";

test.describe.configure({ retries: 0 });

test("adds one skill to the employee profile", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "This test adds persistent employee data; run it once in Chromium."
  );
  test.setTimeout(60000);

  const skillsCatalogResponse = page.waitForResponse((response) =>
    new URL(response.url()).pathname === "/api/skills" && response.ok()
  );
  const employeeSkillsResponsePromise = page.waitForResponse((response) =>
    new URL(response.url()).pathname === "/api/profile/skills/INT001" &&
    response.ok()
  );

  await page.goto(`${appUrl}/profile`);

  const viewLaterButton = page.getByRole("button", {
    name: "View Later",
    exact: true,
  });

  if (await viewLaterButton.isVisible()) {
    await viewLaterButton.click();
  }

  await expect(
    page.getByRole("heading", { name: "My Profile" })
  ).toBeVisible();
  const [, employeeSkillsResponse] = await Promise.all([
    skillsCatalogResponse,
    employeeSkillsResponsePromise,
  ]);

  const employeeSkills = await employeeSkillsResponse.json();
  const existingSkills = new Set(
    employeeSkills.map((skill) => skill.SkillName.trim().toLowerCase())
  );

  await page.getByRole("button", { name: "+ Add Skill" }).click();

  const addSkillDialog = page.getByRole("dialog", { name: "Add Skill" });
  const skillPicker = addSkillDialog.getByRole("combobox", {
    name: "Search skill",
  });
  await skillPicker.click();
  const skillOptions = page.getByRole("option");
  await expect(skillOptions.first()).toBeVisible();

  const availableSkillNames = (
    await skillOptions.allTextContents()
  ).map((name) => name.trim());
  const requestedSkillName = skillName?.trim();
  const requestedSkill = requestedSkillName
    ? availableSkillNames.find(
      (name) => name.toLowerCase() === requestedSkillName.toLowerCase()
    )
    : undefined;

  if (requestedSkillName && !requestedSkill) {
    throw new Error(
      `"${requestedSkillName}" is not available in the skills catalog.`
    );
  }

  const selectedSkillName = requestedSkill &&
    !existingSkills.has(requestedSkill.toLowerCase())
    ? requestedSkill
    : availableSkillNames.find(
      (name) => !existingSkills.has(name.toLowerCase())
    );

  if (!selectedSkillName) {
    throw new Error(
      "No unassigned skills are available in the catalog."
    );
  }

  await skillPicker.fill(selectedSkillName);
  await page.getByRole("option", {
    name: selectedSkillName,
    exact: true,
  }).click();

  await addSkillDialog.getByRole("combobox").nth(1).click();
  await page.getByRole("option", {
    name: proficiencyLevel,
    exact: true,
  }).click();

  await addSkillDialog.getByRole("button", {
    name: "Add Skill",
    exact: true,
  }).click();

  await expect(
    page.getByText("Skill added successfully", { exact: true })
  ).toBeVisible();
});
