<template>
    <div class="m-map">
        <div id="mapContainer" class="map"></div>
    </div>
</template>

<script>
    export default {
        props: ['position'],
        watch: {
            position() {
                this.initMap()
            }
        },
        methods: {
            //BD09系 转 GCJ02系
            bd2gcj(lnglatStr) {
                var pi = Math.PI * 3000.0 / 180.0
                var lnglat = lnglatStr.split(',')
                var x = new Number(lnglat[0])
                var y = new Number(lnglat[1])
                x -= 0.0065
                y -= 0.006
                var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi)
                var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi)
                var gcjX = z * Math.cos(theta)
                var gcjY = z * Math.sin(theta)

                return gcjX.toFixed(6) + ',' + gcjY.toFixed(6)
            },

            // 实例化地图
            initMap() {
                var orglnglat, orgLoc
                var data = this.position

                if (data && data.pushOrglnglat) {
                    orglnglat = this.bd2gcj(data.pushOrglnglat).split(',')
                }
                orgLoc = data.pushOrgLoc

                AMap.plugin(["AMap.Geocoder"], function () {
                    const map = new AMap.Map('mapContainer', {
                        resizeEnable: true,
                        zoom: 18
                    })

                    var marker = new AMap.Marker({  //加点
                        map: map,
                        position: orglnglat
                    })

                    map.setFitView()
                    marker.setTitle(orgLoc)
                })
            }
        },
        mounted() {
            this.initMap()
        },
        async created() {
            this.initMap()
        }
    }

</script>

<style lang="css">
    .m-map {
        min-width: 500px;
        min-height: 300px;
        position: relative;
    }
    
    .m-map .map {
        width: 100%;
        height: 100%;
    }
</style>