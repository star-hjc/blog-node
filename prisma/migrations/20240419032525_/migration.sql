/*
  Warnings:

  - You are about to alter the column `email` on the `t_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(32)`.

*/
-- DropIndex
DROP INDEX `t_user_email_key` ON `t_user`;

-- AlterTable
ALTER TABLE `t_user` MODIFY `email` VARCHAR(32) NULL;
