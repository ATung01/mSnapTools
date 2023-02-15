function MarvelPoolChooser(numCards) {
    let poolList = ['Agent 13', 'Bucky Barnes', 'Cloak', 'Ebony Maw', 'Hobgoblin', 'Iceman', 'Jubilee', 'Killmonger', 
                        'Leech', 'Morbius', 'Nakia', 'Okoye', 'Rhino', 'Sabretooth', 'Sandman', 'Scorpion', 'Shang-Chi', 
                        'Storm', 'Sunspot', 'Swarm', 'The Collector', 'The Infinaut', 'Vision', 'Vulture', 'Warpath']
    let allowedList = []
    
    for (let index = 0; index < numCards; index++) {
        let selected = poolList.splice(Math.floor(Math.random() * poolList.length), 1)
        allowedList.push(selected)   
    }
    return allowedList
}

