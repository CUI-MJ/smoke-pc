export default {
  data() {
    return {
      isDirty: false,
      windowHeight: document.documentElement.clientHeight,
      windowWidth: document.documentElement.clientWidth
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (window.addEventListener) window.addEventListener('resize', this.handleResize.bind(this))
      else if (window.attachEvent) window.attachEvent('resize', this.handleResize.bind(this))
    })
  },
  computed: {
    maxHeight() {
      console.log(this.windowHeight)
      return this.windowHeight > 566 ? (0.92 * this.windowHeight - 150) : 386
    }
  },
  methods: {
    close(data) {
      this.$emit('close');
    },
    beforeClose(done) {
      this._dirtyCheck().then(() => {
        done();
        this.$emit('close');
      }, (_) => {});
    },
    _snapshot(prop, watch) {
      if (!prop) return;
      let data = this.$data[prop];
      if (!data) return;
      this._originData = JSON.parse(JSON.stringify(data));
      // console.log(this._originData)
      this._snapshotProp = prop
      if (watch) {
        this.$watch(prop, (newVal, oldVal) => {
          console.log(newVal)
          this.isDirty = !(JSON.stringify(newVal) === JSON.stringify(this._originData))
        }, { deep: true })
      }
    },
    _snapshotClear() {
      this._originData = null;
      this._snapshotProp = null;
    },
    _snapshotMatched() {
      if (!this._snapshotProp) return true;
      let data = this.$data[this._snapshotProp];
      console.log('dirty check', JSON.stringify(data), JSON.stringify(this._originData));
      return JSON.stringify(data) === JSON.stringify(this._originData);
    },
    _dirtyCheck() {
      return new Promise((resolve, reject) => {
        if (this._snapshotMatched()) {
          resolve();
          this._snapshotClear();
          return;
        }
        console.log('dirty');
        this.$confirm('是否放弃本次修改？')
          .then(_ => {
            resolve(_);
            this._snapshotClear();
          })
          .catch(_ => {
            reject(_);
          });
      });

    },
    handleResize(event) {
      this.windowHeight = document.documentElement.clientHeight
      this.windowWidth = document.documentElement.clientWidth
    }
  }
}
