(()=>{
  
  const it = (description: string, callback:()=>any) => {
    const result = callback()
    return {
      expect: (value: any)=>{
        const status = value === result
        let message = (status) ? '✔' : '✘'
        message += ' '+description
        const dashboard = document.getElementById('result')
        if (dashboard === null) return
        dashboard.innerHTML += `<div class="${status}">${message}</div>`
      }
    }
  }

  setTimeout(()=>{

    it('should resolve correct string placeholder',()=>{
      return document.getElementById('1')?.innerText.trim()
    }).expect('a')

    it('should resolve correct object placeholder',()=>{
      return document.getElementById('2')?.innerText.trim()
    }).expect('a')

    it('should should correct number placeholder',()=>{
      return document.getElementById('3')?.innerText.trim()
    }).expect('2')

    it('should should perform basic addition',()=>{
      return document.getElementById('4')?.innerText.trim()
    }).expect('6')

    it('should should perform basic subtraction',()=>{
      return document.getElementById('5')?.innerText.trim()
    }).expect('2')

    it('should should perform basic multiplication',()=>{
      return document.getElementById('6')?.innerText.trim()
    }).expect('8')

    it('should should perform basic modulo',()=>{
      return document.getElementById('8')?.innerText.trim()
    }).expect('0')

    it('should perform basic arithemtic with object expressions',()=>{
      return document.getElementById('9')?.innerText.trim()
    }).expect('12')

    it('should resolve basic function expression',()=>{
      return document.getElementById('10')?.innerText.trim()
    }).expect('a')

    it('should resolve basic object method expression',()=>{
      return document.getElementById('11')?.innerText.trim()
    }).expect('a')

    it('should resolve basic object method and perform arithmetic',()=>{
      return document.getElementById('12')?.innerText.trim()
    }).expect('16')

    it('should resolve accept variable and constant arguments',()=>{
      return document.getElementById('13')?.innerText.trim()
    }).expect('ak')

  },100)
})();