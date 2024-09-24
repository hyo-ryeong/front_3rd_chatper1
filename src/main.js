// 페이지 로더 함수
function pageLoader(template) {
  document.querySelector('#root').innerHTML = template
}

// 공통 헤더
function renderHeader() {
  const user = JSON.parse(localStorage.getItem('user'))
  const currentPath = window.location.pathname

  return `
    <header class="bg-blue-600 text-white p-4 sticky top-0">
      <h1 class="text-2xl font-bold">항해플러스</h1>
    </header>
    <nav class="bg-white shadow-md p-2 sticky top-14">
      <ul class="flex justify-around">
        <li><a href="/" class="${currentPath === '/' ? 'text-blue-600' : 'text-gray-600'}">홈</a></li>
        ${
          user
            ? `<li><a href="/profile" class="${
                currentPath === '/profile' ? 'text-blue-600' : 'text-gray-600'
              }">프로필</a></li>
              <li><a href="#" id="logout" class="text-gray-600">로그아웃</a></li>`
            : `<li><a href="/login" class="${
                currentPath === '/login' ? 'text-blue-600' : 'text-gray-600'
              }">로그인</a></li>`
        }
      </ul>
    </nav>
  `
}

// 공통 푸터
function renderFooter() {
  return `
    <footer class="bg-gray-200 p-4 text-center">
      <p>&copy; 2024 항해플러스. All rights reserved.</p>
    </footer>
  `
}

// 홈 메인
function renderHome() {
  const homeTemplate = `
    <div class="bg-gray-100 min-h-screen flex justify-center">
      <div class="max-w-md w-full">
        ${renderHeader()}
        <main class="p-4">
          <div class="mb-4 bg-white rounded-lg shadow p-4">
            <textarea class="w-full p-2 border rounded" placeholder="무슨 생각을 하고 계신가요?"></textarea>
            <button class="mt-2 bg-blue-600 text-white px-4 py-2 rounded">게시</button>
          </div>
          <div class="space-y-4">
            <!-- 게시물 리스트 -->
          </div>
        </main>
        ${renderFooter()}
      </div>
    </div>
  `
  pageLoader(homeTemplate)
  addLogoutListener()
}

// 로그인 페이지
function renderLogin() {
  const loginTemplate = `
    <div class="bg-gray-100 flex items-center justify-center min-h-screen">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold text-center text-blue-600 mb-8">항해플러스</h1>
        <form id="login-form">
          <div class="mb-4">
            <input type="text" id="username" placeholder="사용자 이름" class="w-full p-2 border rounded" required>
          </div>
          <div class="mb-4">
            <input type="password" placeholder="비밀번호" class="w-full p-2 border rounded">
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded font-bold">로그인</button>
        </form>
      </div>
    </div>
  `

  pageLoader(loginTemplate)

  // 로그인 클릭 이벤트 리스너
  const loginForm = document.getElementById('login-form')
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const username = document.getElementById('username').value
    if (username) {
      // 사용자 정보 로컬 스토리지에 저장
      localStorage.setItem('user', JSON.stringify({ username: username, email: '', bio: '' }))
      route('/profile')
    }
  })
}

// 프로필 페이지
function renderProfile() {
  let user = JSON.parse(localStorage.getItem('user'))
  if (!user || !user.username) {
    route('/login')
    return
  }

  const profileTemplate = `
    <div class="bg-gray-100 min-h-screen flex justify-center">
      <div class="max-w-md w-full">
        ${renderHeader()} 
        <main class="p-4">
          <div class="bg-white p-8 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold text-center text-blue-600 mb-8">내 프로필</h2>
            <form id="profile-form">
              <div class="mb-4">
                <label for="username" class="block text-gray-700 text-sm font-bold mb-2">사용자 이름</label>
                <input type="text" id="username" value="${user.username}" class="w-full p-2 border rounded" required>
              </div>
              <div class="mb-4">
                <label for="email" class="block text-gray-700 text-sm font-bold mb-2">이메일</label>
                <input type="email" id="email" name="email" value="${user.email}" class="w-full p-2 border rounded">
              </div>
              <div class="mb-6">
                <label for="bio" class="block text-gray-700 text-sm font-bold mb-2">자기소개</label>
                <textarea id="bio" rows="4" class="w-full p-2 border rounded required">${user.bio}</textarea>
              </div>
              <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded font-bold">프로필 업데이트</button>
            </form>
          </div>
        </main>
        ${renderFooter()} 
      </div>
    </div>
  `

  pageLoader(profileTemplate)

  // 로그아웃 버튼 이벤트 리스너
  addLogoutListener()

  // 프로필 폼 이벤트 리스너
  const profileForm = document.getElementById('profile-form')
  profileForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const updatedUsername = document.getElementById('username').value
    const updatedEmail = document.getElementById('email').value
    const updatedBio = document.getElementById('bio').value

    // 업데이트된 사용자 정보 로컬 스토리지에 저장
    localStorage.setItem(
      'user',
      JSON.stringify({
        username: updatedUsername,
        email: updatedEmail,
        bio: updatedBio,
      }),
    )
    alert('프로필이 업데이트되었습니다')
  })
}

// 404 페이지 렌더링
function renderNotFound() {
  const notFoundTemplate = `
    <div class="bg-gray-100 flex items-center justify-center min-h-screen">
      <div class="bg-white p-8 rounded-lg shadow-md w-full text-center" style="max-width: 480px">
        <h1 class="text-2xl font-bold text-blue-600 mb-4">항해플러스</h1>
        <p class="text-4xl font-bold text-gray-800 mb-4">404</p>
        <p class="text-xl text-gray-600 mb-8">페이지를 찾을 수 없습니다</p>
        <p class="text-gray-600 mb-8">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
        <a href="/" class="bg-blue-600 text-white px-4 py-2 rounded font-bold">홈으로 돌아가기</a>
      </div>
    </div>
  `
  pageLoader(notFoundTemplate)
}

// 라우팅 구현
function route(path = window.location.pathname) {
  window.history.pushState({}, '', path)

  if (path === '/' || path === '/main') {
    renderHome()
  } else if (path === '/login') {
    renderLogin()
  } else if (path === '/profile') {
    if (isLogIn()) {
      renderProfile()
    } else {
      renderLogin()
    }
  } else if (path === '/404') {
    renderNotFound()
  } else {
    renderNotFound() // 잘못된 경로 접근 시 바로 NotFound 렌더링
  }
}

// 로그인 여부 확인
function isLogIn() {
  const user = JSON.parse(localStorage.getItem('user'))
  return user && user.username
}

// 로그아웃 버튼
function addLogoutListener() {
  const logoutButton = document.getElementById('logout')
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout)
  }
}

// 로그아웃 함수
function handleLogout(event) {
  event.preventDefault()
  localStorage.removeItem('user')
  route('/login')
}

window.addEventListener('popstate', () => {
  route()
})

//초기 라우팅
document.addEventListener('DOMContentLoaded', () => {
  route()
})
