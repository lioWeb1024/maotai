import dayjs from 'dayjs'

export const getTime = (time: number) => {
    return dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')
}
