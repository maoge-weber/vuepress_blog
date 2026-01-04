<template>
  <div class="study-stats-container">
    <h1>学习统计</h1>
    
    <!-- 时间记录器 -->
    <div class="stats-section">
      <h2>时间记录</h2>
      <div class="timer-container">
        <div class="timer-display">{{ formattedTime }}</div>
        <div class="timer-buttons">
          <button @click="startTimer" v-if="!isRunning" class="btn btn-primary">开始</button>
          <button @click="stopTimer" v-else class="btn btn-danger">停止</button>
        </div>
      </div>
    </div>
    
    <!-- 答题统计 -->
    <div class="stats-section">
      <h2>答题统计</h2>
      <div class="form-container">
        <div class="form-item">
          <label>总题数:</label>
          <input type="number" v-model.number="totalQuestions" min="0" class="input">
        </div>
        <div class="form-item">
          <label>错误题数:</label>
          <input type="number" v-model.number="wrongQuestions" min="0" max="totalQuestions" class="input">
        </div>
        <div class="form-item">
          <label>正确率:</label>
          <div class="accuracy-display">{{ formattedAccuracy }}%</div>
        </div>
        <button @click="saveRecord" class="btn btn-success" :disabled="!canSave">保存记录</button>
      </div>
    </div>
    
    <!-- 历史记录 -->
    <div class="stats-section">
      <h2>历史记录</h2>
      <div class="history-container">
        <div v-if="history.length === 0" class="empty-history">暂无历史记录</div>
        <div v-else class="history-list">
          <div v-for="(record, index) in history" :key="index" class="history-item">
            <div class="history-info">
              <span class="history-date">{{ record.date }}</span>
              <span class="history-time">时间: {{ record.time }}s</span>
              <span class="history-accuracy">正确率: {{ record.accuracy }}%</span>
            </div>
            <button @click="deleteRecord(index)" class="btn btn-small btn-danger">删除</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 统计图表 -->
    <div class="stats-section">
      <h2>学习趋势</h2>
      <div class="chart-container">
        <canvas ref="statsChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudyStats',
  data() {
    return {
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      timerInterval: null,
      totalQuestions: 0,
      wrongQuestions: 0,
      history: [],
      chart: null
    }
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.elapsedTime / 60)
      const seconds = this.elapsedTime % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
    accuracy() {
      if (this.totalQuestions === 0) return 0
      return Math.round(((this.totalQuestions - this.wrongQuestions) / this.totalQuestions) * 100)
    },
    formattedAccuracy() {
      return this.accuracy.toFixed(1)
    },
    canSave() {
      return this.elapsedTime > 0 && this.totalQuestions > 0
    }
  },
  mounted() {
    if (typeof window !== 'undefined') {
      this.loadHistory()
      this.$nextTick(() => {
        this.initChart()
      })
    }
  },
  beforeDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }
    if (this.chart) {
      this.chart.destroy()
    }
  },
  methods: {
    startTimer() {
      this.isRunning = true
      this.startTime = Date.now() - this.elapsedTime * 1000
      this.timerInterval = setInterval(() => {
        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000)
      }, 1000)
    },
    
    stopTimer() {
      this.isRunning = false
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },
    
    resetTimer() {
      this.stopTimer()
      this.elapsedTime = 0
    },
    
    saveRecord() {
      const record = {
        date: new Date().toLocaleString(),
        time: this.elapsedTime,
        totalQuestions: this.totalQuestions,
        wrongQuestions: this.wrongQuestions,
        accuracy: this.accuracy
      }
      
      this.history.push(record)
      this.saveHistory()
      this.resetTimer()
      this.totalQuestions = 0
      this.wrongQuestions = 0
      this.updateChart()
    },
    
    deleteRecord(index) {
      this.history.splice(index, 1)
      this.saveHistory()
      this.updateChart()
    },
    
    saveHistory() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('studyStatsHistory', JSON.stringify(this.history))
      }
    },
    
    loadHistory() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('studyStatsHistory')
        if (saved) {
          this.history = JSON.parse(saved)
        }
      }
    },
    
    initChart() {
      if (typeof window === 'undefined' || !this.$refs.statsChart) return
      
      import('chart.js').then(Chart => {
        const ctx = this.$refs.statsChart.getContext('2d')
        this.chart = new Chart.default(ctx, {
          type: 'line',
          data: {
            labels: this.history.map((_, index) => `记录 ${index + 1}`),
            datasets: [
              {
                label: '时间 (秒)',
                data: this.history.map(record => record.time),
                borderColor: '#00ffff',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                yAxisID: 'y-axis-0',
                tension: 0.3,
                pointBackgroundColor: '#00ffff',
                pointBorderColor: '#00ffff',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#00ffff'
              },
              {
                label: '正确率 (%)',
                data: this.history.map(record => record.accuracy),
                borderColor: '#00ff00',
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                yAxisID: 'y-axis-1',
                tension: 0.3,
                pointBackgroundColor: '#00ff00',
                pointBorderColor: '#00ff00',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#00ff00'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  id: 'y-axis-0',
                  type: 'linear',
                  display: true,
                  position: 'left',
                  scaleLabel: {
                    display: true,
                    labelString: '时间 (秒)',
                    fontColor: '#00ffff'
                  },
                  gridLines: {
                    color: 'rgba(0, 255, 255, 0.1)',
                    drawBorder: true,
                    borderColor: '#00ffff'
                  },
                  ticks: {
                    fontColor: '#00ffff'
                  }
                },
                {
                  id: 'y-axis-1',
                  type: 'linear',
                  display: true,
                  position: 'right',
                  scaleLabel: {
                    display: true,
                    labelString: '正确率 (%)',
                    fontColor: '#00ff00'
                  },
                  min: 0,
                  max: 100,
                  gridLines: {
                    drawOnChartArea: false
                  },
                  ticks: {
                    fontColor: '#00ff00'
                  }
                }
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: '记录次数',
                    fontColor: '#ffffff'
                  },
                  gridLines: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: true,
                    borderColor: '#ffffff'
                  },
                  ticks: {
                    fontColor: '#ffffff'
                  }
                }
              ]
            },
            title: {
              display: true,
              text: '学习统计趋势',
              fontColor: '#ffffff',
              fontSize: 18
            },
            legend: {
              position: 'top',
              labels: {
                fontColor: '#ffffff',
                boxWidth: 10,
                padding: 15
              }
            },
            animation: {
              duration: 1000,
              easing: 'easeInOutQuart'
            }
          }
        })
      }).catch(err => {
        console.error('Failed to load Chart.js:', err)
      })
    },
    
    updateChart() {
      if (!this.chart) {
        this.initChart()
        return
      }
      
      const labels = this.history.map((_, index) => `记录 ${index + 1}`)
      const times = this.history.map(record => record.time)
      const accuracies = this.history.map(record => record.accuracy)
      
      this.chart.data.labels = labels
      this.chart.data.datasets[0].data = times
      this.chart.data.datasets[1].data = accuracies
      this.chart.update()
    }
  }
}
</script>

<style scoped>
/* 科技风格基础样式 */
.study-stats-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  font-family: 'Courier New', monospace;
  color: #ffffff;
}

/* 标题样式 */
h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #00ffff;
  font-size: 2.5rem;
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
  letter-spacing: 2px;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #00ff00;
  font-size: 1.5rem;
  text-shadow: 0 0 5px #00ff00;
  border-bottom: 1px solid rgba(0, 255, 0, 0.3);
  padding-bottom: 10px;
}

/* 卡片样式 */
.stats-section {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stats-section:hover {
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.3);
  border-color: rgba(0, 255, 255, 0.6);
}

/* 时间记录器样式 */
.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.timer-display {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 25px;
  color: #00ffff;
  text-shadow: 0 0 15px #00ffff, 0 0 30px #00ffff;
  letter-spacing: 3px;
  font-family: 'Courier New', monospace;
  background: rgba(0, 255, 255, 0.1);
  padding: 20px 40px;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
}

.timer-buttons {
  display: flex;
  gap: 20px;
}

/* 表单样式 */
.form-container {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  align-items: flex-end;
  padding: 20px 0;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
}

label {
  font-weight: bold;
  color: #00ffff;
  font-size: 1rem;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.input {
  padding: 12px 15px;
  border: 1px solid rgba(0, 255, 255, 0.5);
  border-radius: 4px;
  font-size: 1.1rem;
  width: 120px;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
}

.input:focus {
  outline: none;
  border-color: #00ffff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.9);
}

.accuracy-display {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ff00;
  padding: 12px 0;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
  background: rgba(0, 255, 0, 0.1);
  padding: 10px 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 0, 0.5);
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
}

/* 按钮样式 */
.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background: linear-gradient(45deg, #0066cc, #0099cc);
  color: white;
  box-shadow: 0 0 15px rgba(0, 153, 204, 0.5);
}

.btn-primary:hover {
  background: linear-gradient(45deg, #0099cc, #00ccff);
  box-shadow: 0 0 25px rgba(0, 204, 255, 0.8);
  transform: translateY(-2px);
}

.btn-danger {
  background: linear-gradient(45deg, #cc0033, #ff0033);
  color: white;
  box-shadow: 0 0 15px rgba(255, 0, 51, 0.5);
}

.btn-danger:hover {
  background: linear-gradient(45deg, #ff0033, #ff3366);
  box-shadow: 0 0 25px rgba(255, 51, 102, 0.8);
  transform: translateY(-2px);
}

.btn-success {
  background: linear-gradient(45deg, #006600, #00cc00);
  color: white;
  box-shadow: 0 0 15px rgba(0, 204, 0, 0.5);
}

.btn-success:hover {
  background: linear-gradient(45deg, #00cc00, #33ff33);
  box-shadow: 0 0 25px rgba(51, 255, 51, 0.8);
  transform: translateY(-2px);
}

.btn-success:disabled {
  background: #333333;
  color: #666666;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.btn-small {
  padding: 8px 15px;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

/* 历史记录样式 */
.history-container {
  max-height: 350px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.history-container::-webkit-scrollbar {
  width: 8px;
}

.history-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}

.history-container::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 255, 0.5);
  border-radius: 4px;
}

.history-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 255, 0.8);
}

.empty-history {
  text-align: center;
  color: #666666;
  padding: 40px;
  font-style: italic;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: rgba(0, 0, 0, 0.7);
  border-color: rgba(0, 255, 255, 0.5);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
}

.history-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.history-date {
  font-weight: bold;
  color: #00ffff;
  font-size: 0.95rem;
}

.history-time {
  color: #00ffff;
  background: rgba(0, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.history-accuracy {
  color: #00ff00;
  background: rgba(0, 255, 0, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

/* 图表样式 */
.chart-container {
  height: 450px;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .study-stats-container {
    padding: 15px;
  }
  
  .form-container {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
  
  .form-item {
    min-width: auto;
  }
  
  .input {
    width: auto;
    font-size: 1rem;
  }
  
  .history-info {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .timer-display {
    font-size: 2.5rem;
    padding: 15px 30px;
  }
  
  .timer-buttons {
    gap: 15px;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 1rem;
  }
  
  .chart-container {
    height: 350px;
  }
}
</style>