-- CreateTable
CREATE TABLE `t_user` (
    `id` VARCHAR(36) NOT NULL,
    `code` BIGINT NOT NULL DEFAULT 10000000,
    `email` VARCHAR(32) NULL,
    `phone` VARCHAR(16) NULL,
    `password` VARCHAR(36) NOT NULL,
    `name` VARCHAR(16) NULL,
    `avatar` LONGTEXT NULL,
    `identity` INTEGER NOT NULL DEFAULT 0,
    `WeChat` VARCHAR(32) NULL,
    `QQ` VARCHAR(16) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `t_user_code_key`(`code`),
    UNIQUE INDEX `t_user_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_post` (
    `id` VARCHAR(36) NOT NULL,
    `authorId` VARCHAR(36) NOT NULL,
    `cover` LONGTEXT NOT NULL,
    `title` VARCHAR(32) NOT NULL,
    `content` LONGTEXT NULL,
    `catalog` JSON NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `watch` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_label` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(32) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `t_label_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_star` (
    `id` VARCHAR(36) NOT NULL,
    `postId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `t_star_postId_userId_key`(`postId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_like` (
    `id` VARCHAR(36) NOT NULL,
    `postId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `num` INTEGER NOT NULL DEFAULT 0,
    `todayNum` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `t_like_postId_userId_key`(`postId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_post_label` (
    `id` VARCHAR(36) NOT NULL,
    `postId` VARCHAR(36) NOT NULL,
    `labelId` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `t_post_label_postId_labelId_key`(`postId`, `labelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `t_post` ADD CONSTRAINT `t_post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `t_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_star` ADD CONSTRAINT `t_star_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `t_post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_star` ADD CONSTRAINT `t_star_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `t_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_like` ADD CONSTRAINT `t_like_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `t_post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_like` ADD CONSTRAINT `t_like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `t_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_post_label` ADD CONSTRAINT `t_post_label_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `t_post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_post_label` ADD CONSTRAINT `t_post_label_labelId_fkey` FOREIGN KEY (`labelId`) REFERENCES `t_label`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
