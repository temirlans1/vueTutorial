Vue.component('product', {
    props:{
        premium:{
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <p>User is premium: {{premium}}</p>
            <div>
                <img :src="image"
                height="200px" width="200px">
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p class="outOfStock" v-else>Out of Stock</p>
                
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div class="color-box"
                    v-for="(v, i) in variants" 
                    :key="v.varId"
                    :style="{ backgroundColor: v.varColor}"
                    @mouseover="updProd(i)"
                    >
                </div>
                <div>
                    <button v-on:click="addToCart"
                            :disabled="!inStock"
                            :class="{ disabledButton: !inStock }"
                            >Add to cart
                    </button>
                    <p>Shipping: {{shipping}}</p>
                </div>
                <div>
                    <h2>Reviews</h2>
                    <p v-if="!reviews.length">There are no reviews yet.</p>
                    <ul>
                        <li v-for="review in reviews">
                            <p>{{review.name}}</p>
                            <p>Rating: {{review.rating}}</p>
                            <p>{{review.review}}</p>
                        </li>
                    </ul>
                </div>
                <product-review @review-submitted="addReview"></product-review>
            </div>
        </div>
    `,
    data() {
        return {
            product: 'apple',
            brand: 'Chinese',
            image: './red.png',
            details: ["100% natural", "healthy", "GMO-free"],
            selectedVar: 0,
            variants: [
                {
                    varId: 1,
                    varColor: "red",
                    varImage: "./red.png",
                    varAmount: 10
                },
                {
                    varId: 2,
                    varColor: "green",
                    varImage: "./green.png",
                    varAmount: 10
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart(){
            this.$emit('add-to-cart', this.variants[this.selectedVar].varId)
            if (this.cart >= 5)this.inStock = false
        },
        updProd(index){
            this.selectedVar = index
            this.image = this.variants[index].varImage
        },
        removeFromCart(){
            this.cart -= 1
            if(this.cart < 5)this.inStock = true
        },
        addReview(productReview){
            this.reviews.push(productReview)
        }
    },
    computed: {
        title (){
            return this.brand + ' ' + this.variants[this.selectedVar].varColor + ' ' + this.product
        },
        inStock(){
            return this.variants[this.selectedVar].varAmount
        },
        shipping(){
            if(this.premium){
                return "Free"
            } else {
                return 2.99
            }
        }
    }
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
    
    <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{error}}
            </li>
        </ul>
    </p>
    
    <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name"></input>
        </p>
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>
            <input type="submit" value="Submit"></input>
        </p>
    </form>`,
    data(){
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit(){
            if(this.name && this.review &&this.rating){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
    
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            }
            else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods:{
        updateCart(id) {
            this.cart.push(id)
        }
    }
})