const CANVAS_SCALE = 0.5;
const CANVAS_SIZE = 560


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');


let app = new Vue({
    delimiters: ["[[", "]]"],
    el: '#app',
    data: {
        message: 'Hello Vue!',
        image_url: null,
        data: {
            predictions: [
                {index: 0, value: 0.},
                {index: 1, value: 0.},
                {index: 2, value: 0.},
                {index: 3, value: 0},
                {index: 4, value: 0.},
                {index: 5, value: 0.},
                {index: 6, value: 0.},
                {index: 7, value: 0.},
                {index: 8, value: 0.},
                {index: 9, value: 0.},
            ],
        },
        canvas: null,
        ctx: null,
        isMouseDown: false,
        lastX: 0,
        lastY: 0
    },
    computed: {
        getMaxPrediction: function () {
            const values = this.data.predictions.map((item) => {
                return item.value
            })
            return Math.max(...values)
        },
    },
    methods: {
        clearClickHandler: function () {
            this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
            this.data.predictions = [
                {index: 0, value: 0.},
                {index: 1, value: 0.},
                {index: 2, value: 0.},
                {index: 3, value: 0},
                {index: 4, value: 0.},
                {index: 5, value: 0.},
                {index: 6, value: 0.},
                {index: 7, value: 0.},
                {index: 8, value: 0.},
                {index: 9, value: 0.},
            ]
        },

        canvasMouseDown: function (event) {
            this.isMouseDown = true;
            const x = event.offsetX / CANVAS_SCALE
            const y = event.offsetY / CANVAS_SCALE

            this.lastX = x + 0.001
            this.lastY = y + 0.001
            this.canvasMouseMove(event)
        },

        drawLine: function (fromX, fromY, toX, toY) {
            this.ctx.beginPath()
            this.ctx.moveTo(fromX, fromY)
            this.ctx.lineTo(toX, toY)
            this.ctx.closePath()
            this.ctx.stroke()

        },

        canvasMouseMove: function (event) {
            const x = event.offsetX / CANVAS_SCALE
            const y = event.offsetY / CANVAS_SCALE
            if (this.isMouseDown) {
                this.drawLine(this.lastX, this.lastY, x, y)
            }

            this.lastX = x
            this.lastY = y
        },

        bodyMouseUp: function () {
            this.isMouseDown = false
        },

        bodyMouseOut: function (event) {
            if (!event.relatedTarget || event.relatedTarget.nodeName === 'HTML') {
                this.isMouseDown = false
            }
        },

        getMnistPredictions: function (event) {
            event.preventDefault()

            this.image_url = this.canvas.toDataURL('img/png')
            const hiddenInput = document.getElementById('hiddenInput')
            hiddenInput.value = this.image_url

            const sendImageForm = document.getElementById('sendImageForm')

            const formData = new FormData(sendImageForm)

            fetch(
                window.location.origin + event.target.getAttribute('data-url'),
                {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken,
                        'Accept': 'application/json'
                    },
                    body: formData,
                })
                .then(data => {
                    return data.json()
                })
                .then(res => {
                    this.data.predictions = res.data
                })
        }
    },
    mounted,
})


async function mounted() {
    try {
        this.canvas = document.getElementById('canvas')
        this.ctx = canvas.getContext('2d')

        this.ctx.lineWidth = 100;
        this.ctx.lineJoin = 'round'
        this.ctx.lineCap = 'round'
        this.ctx.textAlign = 'center'


    } catch (error) {
        this.canvas = null
        this.ctx = null
    }
}




