// Body sections weights
let sections = {
    freeShape: { w: 1 },
    head: { w: 7.92 },
    thorax: { w: 10.97 },
    abdominopelvic: { w: 26.39 },
    leftArm: { w: 7.91 },
    leftForearm: { w: 1.513 },
    leftHand: { w: 0.612 },
    leftThigh: { w: 10.008 },
    leftShank: { w: 4.612 },
    leftFoot: { w: 1.431 },
    rightArm: { w: 7.91 },
    rightForearm: { w: 1.513 },
    rightHand: { w: 0.612 },
    rightThigh: { w: 10.008 },
    rightShank: { w: 4.612 },
    rightFoot: { w: 1.431, },
}

// Canvas and drawing context
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight


// Picture as background
const loadImage = (url) => {
    let background = new Image()
    background.src = url
    background.height = window.innerHeight
    background.width = window.innerWidth
    background.onload = function () {
        ctx.drawImage(background, 250, 0)

    }
}

// Form elements
let b_url = document.getElementById("url").value

let b_load = document.getElementById("load")
b_load.addEventListener('click', e => loadImage(b_url))

let b_start = document.getElementById("start")
b_start.addEventListener('click', e => start())

let b_end = document.getElementById("end")
b_end.addEventListener('click', e => end())

let b_centroid = document.getElementById("centroid")
b_centroid.addEventListener('click', e => centroid())

let d_bodySections = document.getElementById("bodySections")

// Variables
let section = sections[d_bodySections.value]
let points = []
let systemCentroid

// Clears current points
const clearPoints = () => points = []

// Set the coordinate points of mouse clicks as (section vertices).
const setPoints = (e) => {
    points.push({
        x: e.offsetX,
        y: e.offsetY,
        w: section.w
    })
    section.points = points
}

// Draws points for section vertices, section centroid and system centroid
const drawPoints = ({ x, y }, type) => {
    if (type === 'point') {
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.stroke()
    }
    if (type === 'section') {
        ctx.beginPath()
        ctx.fillStyle = 'rgba(0,0,255,1)'
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
    }
    if (type === 'system') {
        ctx.beginPath()
        ctx.fillStyle = 'rgba(255,0,0,1)'
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
    }
}

// Fills an area given coordinate points
function drawSection(coordinates) {
    ctx.beginPath()
    ctx.moveTo(coordinates[0].x, coordinates[0].y)
    for (p = 1; p < coordinates.length; p++) {
        ctx.lineTo(coordinates[p].x, coordinates[p].y)
    }
    ctx.fillStyle = 'rgba(200,160,30,0.7)'
    ctx.fill()
    ctx.closePath()
}

// Calculates a centroid based on given coordinates (x,y,w)
function findCentroid(coordinates) {
    let Mx = 0
    let My = 0
    let m = 0
    for (e of coordinates) {
        m += e.w
        Mx += e.w * e.y
        My += e.w * e.x
    }
    let centroid = {
        x: My / m,
        y: Mx / m,
        w: coordinates.w
    }
    return (centroid)
}

// Auxiliary function for start()
function startCallback(e) {
    setPoints(e)
    drawPoints(points[points.length - 1], 'point')
    // console.log(section)
}

// Creates the selected section.
function start() {
    section = sections[d_bodySections.value]
    clearPoints()
    canvas.addEventListener('click', startCallback)
}

// Consolidates the selected section
function end() {
    clearPoints()
    drawSection(section.points)
    section.centroid = findCentroid(section.points)
    drawPoints(section.centroid, 'section')
}

// Finds the system centroid
function centroid() {
    let coordinates = []
    for (s in sections) {
        if (sections[s].centroid) {
            coordinates.push({
                x: sections[s].centroid.x,
                y: sections[s].centroid.y,
                w: sections[s].w
            })
        }
    }
    // console.log(coordinates)
    systemCentroid = findCentroid(coordinates)
    drawPoints(systemCentroid, 'system')
}