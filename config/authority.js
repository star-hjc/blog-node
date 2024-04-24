const READ = 0b00001

const WRITE = 0b00010

const SHARE = 0b00100

const DELETE = 0b01000

const CREATE = 0b10000

/** 可读可写 */
const READ_WRITE = READ | WRITE
/** 可读可写可创建 */
const READ_WRITE_CREATE = READ | WRITE | CREATE

/** 打印对应二进制 */
console.log(READ_WRITE.toString(2).padStart(5, '0'));
console.log(READ_WRITE_CREATE.toString(2).padStart(5, '0'));

/** 判断是否有对应权限 */
console.log('READ_WRITE_CREATE 是否有 CREATE 权限：', (READ_WRITE_CREATE & CREATE) === CREATE)
console.log('READ_WRITE_CREATE 是否有 DELETE 权限：', (READ_WRITE_CREATE & DELETE) === DELETE)

/** 去掉组合权限的读权限 */
const WRITE_CREATE = READ_WRITE_CREATE & ~READ
console.log(WRITE_CREATE.toString(2).padStart(5, '0'));