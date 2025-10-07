// API functions for testing
async function checkStatus() {
    const resultDiv = document.getElementById('api-result');
    if (!resultDiv) return;

    resultDiv.innerHTML = '<div class="loading"></div> Проверяем статус сервера...';

    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        if (response.ok) {
            resultDiv.innerHTML = `
                <h4>✅ Статус сервера: ${data.status}</h4>
                <p><strong>Сообщение:</strong> ${data.message}</p>
                <p><strong>Время:</strong> ${new Date(data.timestamp).toLocaleString('ru-RU')}</p>
                <p><strong>Версия:</strong> ${data.version}</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <h4>❌ Ошибка при проверке статуса</h4>
            <p><strong>Ошибка:</strong> ${error.message}</p>
            <p>Проверьте, что сервер запущен и доступен.</p>
        `;
    }
}

async function getServerInfo() {
    const resultDiv = document.getElementById('api-result');
    if (!resultDiv) return;

    resultDiv.innerHTML = '<div class="loading"></div> Получаем информацию о сервере...';

    try {
        const response = await fetch('/api/info');
        const data = await response.json();
        
        if (response.ok) {
            resultDiv.innerHTML = `
                <h4>📊 Информация о сервере</h4>
                <p><strong>Название:</strong> ${data.name}</p>
                <p><strong>Описание:</strong> ${data.description}</p>
                <p><strong>Версия приложения:</strong> ${data.version}</p>
                <p><strong>Версия Node.js:</strong> ${data.node_version}</p>
                <p><strong>Окружение:</strong> ${data.environment}</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <h4>❌ Ошибка при получении информации</h4>
            <p><strong>Ошибка:</strong> ${error.message}</p>
            <p>Проверьте, что сервер запущен и доступен.</p>
        `;
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#212529';
            break;
        default:
            notification.style.backgroundColor = '#17a2b8';
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS animations for notifications
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Performance monitoring
function measurePageLoadTime() {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
        
        // Show notification if page loads slowly
        if (pageLoadTime > 3000) {
            showNotification('Страница загрузилась медленно. Проверьте соединение.', 'warning');
        }
    });
}

// Network status monitoring
function monitorNetworkStatus() {
    window.addEventListener('online', () => {
        showNotification('Соединение восстановлено!', 'success');
    });
    
    window.addEventListener('offline', () => {
        showNotification('Потеряно соединение с интернетом', 'error');
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Скопировано в буфер обмена!', 'success');
        }).catch(() => {
            showNotification('Ошибка при копировании', 'error');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Скопировано в буфер обмена!', 'success');
        } catch (err) {
            showNotification('Ошибка при копировании', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// Add click handlers for code blocks
function initCodeBlockHandlers() {
    document.querySelectorAll('pre').forEach(pre => {
        pre.style.cursor = 'pointer';
        pre.title = 'Нажмите, чтобы скопировать';
        pre.addEventListener('click', () => {
            copyToClipboard(pre.textContent);
        });
    });
}

// Theme detection and handling
function handleThemePreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.body.classList.add('dark-theme');
    }
    
    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (e.matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    });
}

// Error boundary for JavaScript errors
function setupErrorBoundary() {
    window.addEventListener('error', (event) => {
        console.error('JavaScript error:', event.error);
        showNotification('Произошла ошибка JavaScript. Проверьте консоль.', 'error');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        showNotification('Ошибка в асинхронном коде. Проверьте консоль.', 'error');
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addNotificationStyles();
    measurePageLoadTime();
    monitorNetworkStatus();
    initSmoothScrolling();
    initCodeBlockHandlers();
    handleThemePreference();
    setupErrorBoundary();
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Добро пожаловать в Deploy Test App!', 'success');
    }, 1000);
});

// Export functions for global access
window.checkStatus = checkStatus;
window.getServerInfo = getServerInfo;
window.copyToClipboard = copyToClipboard;