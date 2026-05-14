<template>
  <div class="study-stats-container">
    <!-- 登录表单 -->
    <div v-if="!isLoggedIn" class="login-container">
      <div class="login-card">
        <h1>学习统计</h1>
        <div class="login-form">
          <div class="form-item">
            <label>用户名</label>
            <input type="text" v-model="username" class="input" placeholder="请输入用户名">
          </div>
          <div class="form-item">
            <label>密码</label>
            <input type="password" v-model="password" class="input" placeholder="请输入密码">
          </div>
          <button @click="handleLogin" class="btn btn-primary login-btn" :disabled="!username || !password">
            {{ isLoggingIn ? '登录中...' : '登录' }}
          </button>
          <div v-if="loginError" class="error-message">{{ loginError }}</div>
        </div>
      </div>
    </div>

    <!-- 学习统计页面 -->
    <template v-else>
      <div class="header-bar">
        <h1>学习统计</h1>
        <button @click="handleLogout" class="btn btn-danger logout-btn">退出登录</button>
      </div>

      <!-- 双计时器并排布局 -->
      <div class="dual-timer-container">
        <!-- 答题计时器 -->
        <div class="stats-section timer-section">
          <h2>答题计时</h2>
          <div class="timer-container">
            <div class="timer-display">{{ formattedTime }}</div>
            <div class="timer-buttons">
              <button @click="startTimer" v-if="!isRunning" class="btn btn-primary">开始</button>
              <button @click="stopTimer" v-else class="btn btn-danger">停止</button>
            </div>
          </div>
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
        
        <!-- 学习时间计时器 -->
        <div class="stats-section timer-section">
          <h2>学习时间</h2>
          <div class="timer-container">
            <div class="timer-display study-timer">{{ formattedStudyTime }}</div>
            <div class="timer-buttons">
              <button @click="startStudyTimer" v-if="!isStudyRunning" class="btn btn-primary">开始</button>
              <button @click="stopStudyTimer" v-else class="btn btn-danger">停止</button>
            </div>
          </div>
          <div class="study-time-info">
            <div class="info-item">
              <span class="info-label">本次学习:</span>
              <span class="info-value">{{ formattedStudyTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">累计学习:</span>
              <span class="info-value">{{ formattedTotalTime }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 答题历史记录 -->
      <div class="stats-section">
        <h2>答题记录</h2>
        <div class="history-container">
          <div v-if="answerHistory.length === 0" class="empty-history">暂无答题记录</div>
          <div v-else class="history-list">
            <div v-for="(record, index) in answerHistory" :key="record.id || index" class="history-item">
              <div class="history-info">
                <span class="history-date">{{ formatDate(record.study_time) }}</span>
                <span class="history-time">用时: {{ record.study_minutes.toFixed(1) }}分钟</span>
                <span class="history-questions">答题: {{ record.total_questions }}题</span>
                <span class="history-wrong">错误: {{ record.wrong_questions }}题</span>
                <span class="history-accuracy">正确率: {{ record.accuracy }}%</span>
              </div>
              <button @click="deleteAnswerRecord(index)" class="btn btn-small btn-danger">删除</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 学习时间记录 -->
      <div class="stats-section">
        <h2>学习时间记录</h2>
        <div class="history-container">
          <div v-if="studyTimeHistory.length === 0" class="empty-history">暂无学习时间记录</div>
          <div v-else class="history-list">
            <div v-for="(record, index) in studyTimeHistory" :key="record.id || index" class="history-item study-time-record">
              <div class="history-info">
                <span class="history-date">{{ formatDate(record.study_time) }}</span>
                <span class="history-time">时长: {{ record.study_minutes.toFixed(1) }}分钟</span>
                <span class="history-study-tag">纯学习时间</span>
              </div>
              <button @click="deleteStudyTimeRecord(index)" class="btn btn-small btn-danger">删除</button>
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
      
      <!-- 学习时间统计 -->
      <div class="stats-section">
        <h2>学习时间统计</h2>
        <div class="overall-stats-container">
          <div class="stat-card">
            <div class="stat-label">总学习次数</div>
            <div class="stat-value total-count">{{ studyStats.total_study_times || totalStudyCount }}次</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">总学习时间</div>
            <div class="stat-value total-time">{{ formattedTotalTime }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">平均学习时间</div>
            <div class="stat-value avg-time">{{ studyStats.avg_study_minutes ? formatMinutes(studyStats.avg_study_minutes) : formattedAvgTime }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">最长学习时间</div>
            <div class="stat-value max-time">{{ formattedMaxTime }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">最短学习时间</div>
            <div class="stat-value min-time">{{ formattedMinTime }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">累计答题数</div>
            <div class="stat-value total-questions">{{ studyStats.total_questions || totalQuestionsCount }}题</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">累计错误数</div>
            <div class="stat-value total-wrong">{{ studyStats.total_wrong || totalWrongCount }}题</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">总体正确率</div>
            <div class="stat-value overall-accuracy">{{ studyStats.total_accuracy || formattedOverallAccuracy }}%</div>
          </div>
        </div>
        <div class="progress-section">
          <h3>学习进度</h3>
          <div class="progress-bar-container">
            <div class="progress-info">
              <span>学习目标: {{ studyStats.target_hours || studyGoal }}小时</span>
              <span>已完成: {{ formattedTotalHours }}小时</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <div class="progress-percentage">{{ progressPercentage.toFixed(1) }}%</div>
          </div>
          <div class="goal-setting">
            <label>设置学习目标(小时):</label>
            <input type="number" v-model.number="studyGoal" min="1" class="input goal-input">
            <button @click="updateStudyGoal" class="btn btn-primary goal-save-btn">保存</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'StudyStats',
  data() {
    return {
      // 登录状态
      isLoggedIn: false,
      isLoggingIn: false,
      username: '',
      password: '',
      loginError: '',
      
      // 答题计时器
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      timerInterval: null,
      totalQuestions: 0,
      wrongQuestions: 0,
      answerHistory: [],
      studyTimeHistory: [],
      chart: null,
      studyGoal: 100,
      
      // 学习时间计时器
      isStudyRunning: false,
      studyStartTime: null,
      studyElapsedTime: 0,
      studyTimerInterval: null,
      
      // 后台统计数据
      studyStats: {
        total_study_times: 0,
        total_study_minutes: 0,
        avg_study_minutes: 0,
        max_study_minutes: 0,
        min_study_minutes: 0,
        total_questions: 0,
        total_correct: 0,
        total_wrong: 0,
        total_accuracy: 0,
        target_hours: 100
      },
      
      // API基础地址
      apiBase: 'http://localhost:3000/api'
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
    },
    formattedStudyTime() {
      const hours = Math.floor(this.studyElapsedTime / 3600)
      const minutes = Math.floor((this.studyElapsedTime % 3600) / 60)
      const seconds = this.studyElapsedTime % 60
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
    // 学习时间统计相关
    studyTimeTotalMinutes() {
      return this.studyTimeHistory.reduce((sum, record) => sum + record.study_minutes, 0)
    },
    totalStudyCount() {
      return this.studyTimeHistory.length
    },
    formattedTotalTime() {
      const totalMinutes = this.studyStats.total_study_minutes || this.studyTimeTotalMinutes
      const hours = Math.floor(totalMinutes / 60)
      const minutes = Math.floor(totalMinutes % 60)
      return `${hours}小时${minutes}分钟`
    },
    formattedTotalHours() {
      const totalMinutes = this.studyStats.total_study_minutes || this.studyTimeTotalMinutes
      return (totalMinutes / 60).toFixed(2)
    },
    formattedAvgTime() {
      const avgMinutes = this.studyStats.avg_study_minutes || (this.totalStudyCount > 0 ? this.studyTimeTotalMinutes / this.totalStudyCount : 0)
      const hours = Math.floor(avgMinutes / 60)
      const minutes = Math.floor(avgMinutes % 60)
      if (hours > 0) {
        return `${hours}小时${minutes}分钟`
      }
      return `${minutes.toFixed(1)}分钟`
    },
    formattedMaxTime() {
      if (this.studyStats.max_study_minutes) {
        const hours = Math.floor(this.studyStats.max_study_minutes / 60)
        const minutes = Math.floor(this.studyStats.max_study_minutes % 60)
        if (hours > 0) return `${hours}小时${minutes}分钟`
        return `${this.studyStats.max_study_minutes}分钟`
      }
      if (this.studyTimeHistory.length === 0) return '0分钟'
      const maxMinutes = Math.max(...this.studyTimeHistory.map(r => r.study_minutes))
      const hours = Math.floor(maxMinutes / 60)
      const minutes = Math.floor(maxMinutes % 60)
      if (hours > 0) return `${hours}小时${minutes}分钟`
      return `${maxMinutes}分钟`
    },
    formattedMinTime() {
      if (this.studyStats.min_study_minutes) {
        const hours = Math.floor(this.studyStats.min_study_minutes / 60)
        const minutes = Math.floor(this.studyStats.min_study_minutes % 60)
        if (hours > 0) return `${hours}小时${minutes}分钟`
        return `${this.studyStats.min_study_minutes}分钟`
      }
      if (this.studyTimeHistory.length === 0) return '0分钟'
      const minMinutes = Math.min(...this.studyTimeHistory.map(r => r.study_minutes))
      const hours = Math.floor(minMinutes / 60)
      const minutes = Math.floor(minMinutes % 60)
      if (hours > 0) return `${hours}小时${minutes}分钟`
      return `${minMinutes}分钟`
    },
    // 答题统计相关
    totalQuestionsCount() {
      return this.answerHistory.reduce((sum, record) => sum + record.total_questions, 0)
    },
    totalWrongCount() {
      return this.answerHistory.reduce((sum, record) => sum + record.wrong_questions, 0)
    },
    formattedOverallAccuracy() {
      const totalQs = this.studyStats.total_questions || this.totalQuestionsCount
      if (totalQs === 0) return '0.0'
      const correctCount = totalQs - (this.studyStats.total_wrong || this.totalWrongCount)
      return ((correctCount / totalQs) * 100).toFixed(1)
    },
    progressPercentage() {
      const goal = this.studyStats.target_hours || this.studyGoal
      if (goal <= 0) return 0
      const percentage = (parseFloat(this.formattedTotalHours) / goal) * 100
      return Math.min(percentage, 100)
    }
  },
  mounted() {
    if (typeof window !== 'undefined') {
      this.checkLoginStatus()
    }
  },
  beforeDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }
    if (this.studyTimerInterval) {
      clearInterval(this.studyTimerInterval)
    }
    if (this.chart) {
      this.chart.destroy()
    }
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const token = localStorage.getItem('study_token')
      if (token) {
        this.isLoggedIn = true
        this.loadAllData()
      }
    },
    
    // 登录
    async handleLogin() {
      if (!this.username || !this.password) return
      
      this.isLoggingIn = true
      this.loginError = ''
      
      try {
        const response = await fetch(`${this.apiBase}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        })
        
        const data = await response.json()
        
        if (data.code === 200) {
          localStorage.setItem('study_token', 'logged_in')
          this.isLoggedIn = true
          this.loadAllData()
        } else {
          this.loginError = data.message || '登录失败'
        }
      } catch (error) {
        this.loginError = '网络错误，请稍后重试'
      } finally {
        this.isLoggingIn = false
      }
    },
    
    // 退出登录
    handleLogout() {
      localStorage.removeItem('study_token')
      this.isLoggedIn = false
      this.username = ''
      this.password = ''
      this.loginError = ''
    },
    
    // 答题计时器
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
    
    // 学习时间计时器
    startStudyTimer() {
      this.isStudyRunning = true
      this.studyStartTime = Date.now() - this.studyElapsedTime * 1000
      this.studyTimerInterval = setInterval(() => {
        this.studyElapsedTime = Math.floor((Date.now() - this.studyStartTime) / 1000)
      }, 1000)
    },
    
    stopStudyTimer() {
      this.isStudyRunning = false
      if (this.studyTimerInterval) {
        clearInterval(this.studyTimerInterval)
        this.studyTimerInterval = null
      }
      
      if (this.studyElapsedTime > 0) {
        this.saveStudyTimeRecord({
          study_minutes: Math.floor(this.studyElapsedTime / 60)
        })
        this.studyElapsedTime = 0
      }
    },
    
    resetTimer() {
      this.stopTimer()
      this.elapsedTime = 0
    },
    
    // 保存答题记录
    saveRecord() {
      this.saveAnswerRecord({
        study_minutes: Math.floor(this.elapsedTime / 60),
        total_questions: this.totalQuestions,
        wrong_questions: this.wrongQuestions,
        accuracy: this.accuracy
      })
      
      this.resetTimer()
      this.totalQuestions = 0
      this.wrongQuestions = 0
    },
    
    // 保存答题记录到后台
    async saveAnswerRecord(record) {
      try {
        const response = await fetch(`${this.apiBase}/pc/study/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            study_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
            study_minutes: record.study_minutes,
            total_questions: record.total_questions,
            wrong_questions: record.wrong_questions,
            accuracy: record.accuracy
          })
        })
        
        const data = await response.json()
        
        if (data.code === 200) {
          const newRecord = {
            id: data.data.id,
            study_time: new Date().toLocaleString(),
            study_minutes: record.study_minutes,
            total_questions: record.total_questions,
            wrong_questions: record.wrong_questions,
            accuracy: record.accuracy
          }
          this.answerHistory.unshift(newRecord)
          this.updateChart()
          await this.loadStudyStats()
        }
      } catch (error) {
        console.error('保存答题记录失败:', error)
      }
    },
    
    // 保存学习时间记录到后台
    async saveStudyTimeRecord(record) {
      try {
        const response = await fetch(`${this.apiBase}/pc/study/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            study_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
            study_minutes: record.study_minutes,
            total_questions: 0,
            wrong_questions: 0,
            accuracy: 0
          })
        })
        
        const data = await response.json()
        
        if (data.code === 200) {
          const newRecord = {
            id: data.data.id,
            study_time: new Date().toLocaleString(),
            study_minutes: record.study_minutes
          }
          this.studyTimeHistory.unshift(newRecord)
          await this.loadStudyStats()
        }
      } catch (error) {
        console.error('保存学习时间记录失败:', error)
      }
    },
    
    async deleteAnswerRecord(index) {
      const record = this.answerHistory[index]
      if (!record.id) return
      
      try {
        const response = await fetch(`${this.apiBase}/pc/study/history/${record.id}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        
        if (data.code === 200) {
          this.answerHistory.splice(index, 1)
          this.updateChart()
          await this.loadStudyStats()
        }
      } catch (error) {
        console.error('删除答题记录失败:', error)
      }
    },
    
    async deleteStudyTimeRecord(index) {
      const record = this.studyTimeHistory[index]
      if (!record.id) return
      
      try {
        const response = await fetch(`${this.apiBase}/pc/study/history/${record.id}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        
        if (data.code === 200) {
          this.studyTimeHistory.splice(index, 1)
          await this.loadStudyStats()
        }
      } catch (error) {
        console.error('删除学习时间记录失败:', error)
      }
    },
    
    // 加载学习统计数据
    async loadStudyStats() {
      try {
        const response = await fetch(`${this.apiBase}/pc/study/stats`)
        const data = await response.json()
        
        if (data.code === 200) {
          this.studyStats = data.data
          this.studyGoal = data.data.target_hours || 100
        }
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    },
    
    // 加载答题历史记录
    async loadAnswerHistory() {
      try {
        const response = await fetch(`${this.apiBase}/pc/study/history`)
        const data = await response.json()
        
        if (data.code === 200) {
          this.answerHistory = data.data.list.filter(record => record.total_questions > 0)
        }
      } catch (error) {
        console.error('加载答题历史记录失败:', error)
      }
    },
    
    // 加载学习时间历史记录
    async loadStudyTimeHistory() {
      try {
        const response = await fetch(`${this.apiBase}/pc/study/history`)
        const data = await response.json()
        
        if (data.code === 200) {
          this.studyTimeHistory = data.data.list.filter(record => record.total_questions === 0)
        }
      } catch (error) {
        console.error('加载学习时间历史记录失败:', error)
      }
    },
    
    // 更新学习目标
    async updateStudyGoal() {
      try {
        await fetch(`${this.apiBase}/pc/study/stats`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...this.studyStats,
            target_hours: this.studyGoal
          })
        })
      } catch (error) {
        console.error('更新学习目标失败:', error)
      }
    },
    
    loadAllData() {
      this.loadStudyStats()
      this.loadAnswerHistory()
      this.loadStudyTimeHistory()
      this.$nextTick(() => {
        this.initChart()
      })
    },
    
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    },
    
    formatMinutes(minutes) {
      const hours = Math.floor(minutes / 60)
      const mins = Math.floor(minutes % 60)
      if (hours > 0) {
        return `${hours}小时${mins}分钟`
      }
      return `${mins}分钟`
    },
    
    initChart() {
      if (typeof window === 'undefined' || !this.$refs.statsChart) return
      
      import('chart.js').then(Chart => {
        const ctx = this.$refs.statsChart.getContext('2d')
        const recordCount = this.answerHistory.length;
        const barWidth = recordCount < 10 ? 0.1 : 0.6;
        const categoryWidth = recordCount < 10 ? 0.1 : 0.8;
        
        this.chart = new Chart.default(ctx, {
          type: 'bar',
          data: {
            labels: this.answerHistory.map(record => {
              const date = new Date(record.study_time || record.date);
              return `${(date.getFullYear() % 100).toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
            }),
            datasets: [
              {
                label: '正确率 (%)',
                data: this.answerHistory.map(record => record.accuracy),
                backgroundColor: 'rgba(0, 255, 0, 0.7)',
                borderColor: '#00ff00',
                borderWidth: 1,
                yAxisID: 'y-axis-1',
                barPercentage: barWidth,
                categoryPercentage: categoryWidth,
              },
              {
                label: '用时 (分钟)',
                data: this.answerHistory.map(record => parseFloat(record.study_minutes.toFixed(1))),
                borderColor: '#00ffff',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                yAxisID: 'y-axis-0',
                type: 'line',
                tension: 0.3,
                pointBackgroundColor: '#00ffff',
                pointBorderColor: '#00ffff',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#00ffff'
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
                    labelString: '用时 (分钟)',
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
                    labelString: '日期',
                    fontColor: '#ffffff'
                  },
                  gridLines: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: true,
                    borderColor: '#ffffff'
                  },
                  ticks: {
                    fontColor: '#ffffff',
                    maxRotation: 45,
                    minRotation: 45
                  }
                }
              ]
            },
            title: {
              display: true,
              text: '答题统计趋势',
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
      
      const recordCount = this.answerHistory.length;
      const barWidth = recordCount < 10 ? 0.1 : 0.6;
      const categoryWidth = recordCount < 10 ? 0.1 : 0.8;
      
      const labels = this.answerHistory.map(record => {
        const date = new Date(record.study_time || record.date);
        return `${(date.getFullYear() % 100).toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
      })
      const accuracies = this.answerHistory.map(record => record.accuracy)
      const times = this.answerHistory.map(record => parseFloat(record.study_minutes.toFixed(1)))
      
      this.chart.data.labels = labels
      this.chart.data.datasets[0].data = accuracies
      this.chart.data.datasets[0].barPercentage = barWidth
      this.chart.data.datasets[0].categoryPercentage = categoryWidth
      this.chart.data.datasets[1].data = times
      this.chart.update()
    }
  }
}
</script>

<style scoped>
/* 登录容器样式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-card {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.5);
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
  text-align: center;
}

.login-card h1 {
  margin-bottom: 30px;
  color: #00ffff;
  font-size: 2rem;
  text-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-form .form-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.login-form label {
  color: #00ffff;
  font-weight: bold;
}

.login-form .input {
  width: 92%;
  padding: 12px 15px;
  border: 1px solid rgba(0, 255, 255, 0.5);
  border-radius: 4px;
  font-size: 1.1rem;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;
}

.login-form .input:focus {
  outline: none;
  border-color: #00ffff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

.login-btn {
  width: 100%;
  padding: 15px;
  font-size: 1.2rem;
}

.error-message {
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 10px;
  min-height: 20px;
}

/* 头部栏 */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.logout-btn {
  padding: 10px 20px;
  font-size: 1rem;
}

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
  padding: 20px 20px;
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
  width: 80px;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

/* 历史记录样式 */
.history-container {
  max-height: 500px;
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

.history-questions {
  color: #ffff00;
  background: rgba(255, 255, 0, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 0, 0.3);
}

.history-wrong {
  color: #ff00ff;
  background: rgba(255, 0, 255, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 0, 255, 0.3);
}

.history-study-tag {
  color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 136, 0.3);
  font-weight: bold;
}

.study-time-record {
  border-left: 3px solid #00ff88;
}

.history-accuracy {
  color: #00ff00;
  background: rgba(0, 255, 0, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

/* 双计时器布局 */
.dual-timer-container {
  display: flex;
  gap: 25px;
  justify-content: space-between;
}

.timer-section {
  flex: 1;
  min-width: 300px;
}

.timer-section .form-container {
  flex-wrap: wrap;
  gap: 15px;
  justify-content: flex-start;
}

.timer-section .form-item {
  flex: 0 0 calc(50% - 8px);
  min-width: 140px;
}

.study-timer {
  color: #00ff88 !important;
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.8) !important;
}

.study-time-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed rgba(0, 255, 255, 0.1);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #00ffff;
  font-size: 0.95rem;
}

.info-value {
  color: #00ff88;
  font-weight: bold;
  font-size: 1rem;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
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

/* 学习时间统计样式 */
.overall-stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  border-color: rgba(0, 255, 255, 0.6);
  transform: translateY(-3px);
}

.stat-label {
  font-size: 0.95rem;
  color: #00ffff;
  margin-bottom: 12px;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 10px currentColor;
}

.stat-value.total-count {
  color: #00ffff;
}

.stat-value.total-time {
  color: #00ff88;
}

.stat-value.avg-time {
  color: #ffff00;
}

.stat-value.max-time {
  color: #ff00ff;
}

.stat-value.min-time {
  color: #ff8800;
}

.stat-value.total-questions {
  color: #00ffff;
}

.stat-value.total-wrong {
  color: #ff4444;
}

.stat-value.overall-accuracy {
  color: #00ff00;
}

/* 学习进度样式 */
.progress-section {
  margin-top: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.progress-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #00ff00;
  font-size: 1.3rem;
  text-shadow: 0 0 5px #00ff00;
}

.progress-bar-container {
  margin-bottom: 25px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 1rem;
  color: #00ffff;
}

.progress-bar {
  height: 30px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #00ffff, #00ff88);
  border-radius: 15px;
  transition: width 0.5s ease;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
  animation: progress-glow 2s ease-in-out infinite;
}

@keyframes progress-glow {
  0%, 100% {
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 25px rgba(0, 255, 0, 0.8);
  }
}

.progress-percentage {
  text-align: center;
  margin-top: 12px;
  font-size: 1.3rem;
  font-weight: bold;
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
}

.goal-setting {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
}

.goal-setting label {
  white-space: nowrap;
}

.goal-input {
  width: 100px;
}

.goal-save-btn {
  padding: 10px 20px;
  font-size: 0.95rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .study-stats-container {
    padding: 15px;
  }
  
  .dual-timer-container {
    flex-direction: column;
  }
  
  .timer-section {
    min-width: auto;
  }
  
  .timer-section .form-item {
    flex: 1;
    min-width: auto;
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
  
  .overall-stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-value {
    font-size: 1.4rem;
  }
  
  .goal-setting {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .goal-input {
    width: 100%;
  }
  
  .login-card {
    padding: 30px 20px;
  }
  
  .header-bar {
    flex-direction: column;
    gap: 15px;
  }
}
</style>