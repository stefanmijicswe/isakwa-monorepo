/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `scientific_fields` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `states` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `title_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "scientific_fields_name_key" ON "scientific_fields"("name");

-- CreateIndex
CREATE UNIQUE INDEX "states_name_key" ON "states"("name");

-- CreateIndex
CREATE UNIQUE INDEX "title_types_name_key" ON "title_types"("name");
