<style scoped lang="scss">
    .comment-body {
        margin-top: 15px;

        .comment-item {
            padding-bottom: 10px;
            margin-bottom: 15px;
            border-bottom: dotted 1px #dcdfe4;
            .goods {
                flex-direction: row;
                display: flex;
                padding: 0 5px;
                margin-bottom: 15px;

                .cover {
                    width: 80px;
                    height: 80px;
                    border-radius: 5px;
                }

                .right {
                    flex: 1;
                    display: flex;
                    padding-left: 15px;
                    flex-direction: column;

                    .name {
                        font-size: 16px;
                    }

                    .real_price {
                        margin-top: 10px;
                        flex-direction: row;
                        display: flex;

                        .price {
                            margin-left: 15px;
                            text-decoration: line-through;
                        }
                    }

                    .num {
                        margin-top: 10px;
                    }
                }
            }
        }
    }

</style>
<template>
    <div class="">
        <!--评论-->
        <view v-if="type != 'order'" class="comment-item">

            <u-row gutter="0">
                <u-col span="3">
                    <view style="margin-left:15px">环境评分</view>
                </u-col>
                <u-col span="8">
                    <u-rate :current="5" @change="changeHealth" active-icon="heart-fill" inactive-icon="heart"></u-rate>
                </u-col>
            </u-row>
            <u-gap height="15"></u-gap>

            <u-row gutter="0">
                <u-col span="3">
                    <view style="margin-left:15px">服务评分</view>
                </u-col>
                <u-col span="8">
                    <u-rate :current="5" @change="changeStaff" active-icon="heart-fill" inactive-icon="heart"></u-rate>
                </u-col>
            </u-row>

            <u-gap height="15"></u-gap>
            <u-row gutter="0">
                <u-col span="3">
                    <view style="margin-left:15px">商品评分</view>
                </u-col>
                <u-col span="8">
                    <u-rate :current="5" @change="changeGoods" active-icon="heart-fill" inactive-icon="heart"></u-rate>
                </u-col>
            </u-row>

            <u-gap height="15"></u-gap>
            <view class="u-flex ">
                <u-upload class="u-flex u-flex-1" ref="uUpload"
                          :action="'/v1/file/uploadImage'"
                          :header="uploadHeader"
                          :form-data="uploadFormData"
                          @on-uploaded="onUploaded"
                          :max-size="5 * 1024 * 1024" max-count="12"
                          :auto-upload="true"></u-upload>
                <!-- <u-button @click="uploadImg" size="mini" type='success'>上传</u-button> -->
            </view>

            <u-gap height="15"></u-gap>
            <u-cell-group>
                <u-field v-model="comment.content" label="评论内容" placeholder="请输入您想要说的话"
                         type="textarea" maxlength="128">
                </u-field>
            </u-cell-group>

            <u-gap height="15"></u-gap>
            <u-button @click="submit_comment">提交评论</u-button>
        </view>

        <!--评论-->
        <view v-if="type == 'order'" class="comment-body">
            <view v-for="(goods,index ) in goodsList" :key="index" class="comment-item">
                <view class="goods">
                    <image class="cover" :src="goods.cover"></image>
                    <view class="right">
                        <view class="name">{{goods.name}}</view>
                        <view class="real_price">{{goods.real_price}}
                            <view class="price">{{goods.price}}</view>
                        </view>
                        <view class="num">x {{goods.num}}</view>
                    </view>
                </view>
                <u-row gutter="0">
                    <u-col span="3">
                        <view style="margin-left:15px">环境评分</view>
                    </u-col>
                    <u-col span="8">
                        <u-rate v-model="goods.health" active-icon="heart-fill" inactive-icon="heart"></u-rate>
                    </u-col>
                </u-row>
                <u-gap height="15"></u-gap>

                <u-row gutter="0">
                    <u-col span="3">
                        <view style="margin-left:15px">服务评分</view>
                    </u-col>
                    <u-col span="8">
                        <u-rate v-model="goods.staff" active-icon="heart-fill" inactive-icon="heart"></u-rate>
                    </u-col>
                </u-row>

                <u-gap height="15"></u-gap>
                <u-row gutter="0">
                    <u-col span="3">
                        <view style="margin-left:15px">商品评分</view>
                    </u-col>
                    <u-col span="8">
                        <u-rate v-model="goods.goods" active-icon="heart-fill" inactive-icon="heart"></u-rate>
                    </u-col>
                </u-row>

                <u-gap height="15"></u-gap>
                <view class="u-flex ">
                    <u-upload class="u-flex u-flex-1" ref="uUpload"
                              :action="host"
                              :name="'image'"
                              :header="uploadHeader"
                              :form-data="uploadFormData"
                              @on-uploaded="onUploaded"
                              @on-choose-complete="onChooseComplete(goods)"
                              :max-size="5 * 1024 * 1024" max-count="12"
                              :auto-upload="true"></u-upload>
                    <!-- <u-button @click="uploadImg" size="mini" type='success'>上传</u-button> -->
                </view>

                <u-gap height="15"></u-gap>
                <u-cell-group>
                    <u-field v-model="goods.content" label="评论内容" placeholder="请输入您想要说的话"
                             type="textarea" maxlength="128">
                    </u-field>
                </u-cell-group>

                <u-gap height="15"></u-gap>
                <u-button @click="submit_comment(goods)">提交评论</u-button>
            </view>
        </view>
    </div>
</template>

<script>
    import {submitComment, getGoodsCommentNum} from "../../api/comment"
    import {parseDate} from "../../utils/date"

    export default {
        data() {
            return {
                host: 'http://localhost:8888/v1/file/uploadImage',
                commentContent: "",
                loading: true,
                goods_id: 0,
                order_no: '',
                com_id: 0,
                goods_name: '加载失败',
                goods_cover: 'http://img.xytschool.com/icon/ticket.png',
                comment: {
                    health: 5,
                    goods: 5,
                    staff: 5,
                    covers: [],
                    content: '',
                    com_id: 0,
                    goods_id: 0,
                    order_no: '',
                    pid: 0
                },
                uploadHeader: {},
                uploadFormData: {},
                goodsCover: "https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg",
                goodsList: [],
                type: '',
                currentGoods: {}
            };
        },
        onLoad(options) {
            this.order_no = options.order_no
            this.type = options.type ? options.type : 'order'
            if (this.type == 'order') {
                let goodsList = JSON.parse(options.goodsList)
                this.goodsList = goodsList.map((item) => {
                    item.health = 5
                    item.staff = 5
                    item.goods = 5
                    item.covers = []
                    item.content = ''
                    item.com_id = this.com_id
                    item.order_no = this.order_no
                    return item
                })
                console.log('this.goodsList', this.goodsList)
            }
        },
        methods: {
            parseDate(date) {
                return parseDate(date)
            },
            onChooseComplete(goods) {
                this.currentGoods = goods
            },
            submit_comment(goods) {
                if(goods.is_comment){
                    uni.showToast({
                        title: '您已经评论',
                        duration: 2000
                    });
                    return
                }
                console.log('goods ->', goods)
                if (goods.content.length < 6) {
                    uni.showToast({
                        title: '请您输入6个以上的字符',
                        duration: 2000
                    });
                    return
                }
                uni.showLoading()

                submitComment( goods ).then(res => {
                    uni.hideLoading()
                    if (res.code == 200) {
                        uni.showToast({
                            title: '评论成功',
                            duration: 2000
                        })
                        goods.is_comment = true
                    } else {
                        uni.showToast({
                            title: '评论失败' + res.msg,
                            duration: 2000
                        })
                    }
                })
            },
            uploadImg() {
                this.$refs.uUpload.upload();
            },
            onUploaded(lists) {
                var covers = []
                lists.forEach(element => {
                    let item = element.response.data.path
                    covers.push(item)
                });
                this.currentGoods.covers = covers
            }
        }
    };
</script>
