-- CreateTable
CREATE TABLE `User_info` (
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `last_login` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_info_name_key`(`name`),
    UNIQUE INDEX `User_info_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_role` (
    `role` ENUM('USER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'USER',
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_role_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_todolist` (
    `todolist_id` VARCHAR(191) NOT NULL,
    `todolist_title` VARCHAR(191) NOT NULL DEFAULT 'No title',
    `style` INTEGER NOT NULL DEFAULT 0,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`todolist_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Todolist_todo` (
    `todo_id` VARCHAR(191) NOT NULL,
    `todo_title` VARCHAR(191) NOT NULL DEFAULT 'No title',
    `todolist_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`todo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Todo_info` (
    `todo_id` VARCHAR(191) NOT NULL,
    `todo_title` VARCHAR(191) NOT NULL DEFAULT 'No title',
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `style` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`todo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_note` (
    `note_id` VARCHAR(191) NOT NULL,
    `note_title` VARCHAR(191) NOT NULL DEFAULT 'No title',
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`note_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User_role` ADD CONSTRAINT `User_role_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User_info`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_todolist` ADD CONSTRAINT `User_todolist_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User_info`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todolist_todo` ADD CONSTRAINT `Todolist_todo_todolist_id_fkey` FOREIGN KEY (`todolist_id`) REFERENCES `User_todolist`(`todolist_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todo_info` ADD CONSTRAINT `Todo_info_todo_id_fkey` FOREIGN KEY (`todo_id`) REFERENCES `Todolist_todo`(`todo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_note` ADD CONSTRAINT `User_note_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User_info`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
