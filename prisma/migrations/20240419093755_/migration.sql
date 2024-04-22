/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `t_user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `t_label` ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `t_user_phone_key` ON `t_user`(`phone`);
