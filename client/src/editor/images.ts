export function clipboardImages(data: DataTransfer | null) {
  if (!data) return []
  const items = Array.from(data.items || []).filter(item => item.kind === 'file' && item.type.startsWith('image/')).map(item => item.getAsFile()).filter((file): file is File => !!file)
  return items.length ? items : Array.from(data.files || []).filter(file => file.type.startsWith('image/'))
}

export async function readImage(file: File) {
  if (!/^image\/(png|jpe?g|webp|gif|svg\+xml|avif|bmp)$/i.test(file.type)) throw new Error('请粘贴 PNG、JPG、WebP、GIF、SVG、AVIF 或 BMP 图片')
  if (file.size > 8 * 1024 * 1024) throw new Error('单张图片最大 8 MB，请缩小图片后再粘贴')
  const src = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('图片读取失败，请重新复制后粘贴'))
    reader.readAsDataURL(file)
  })
  return { src, alt: file.name || '粘贴的图片' }
}
