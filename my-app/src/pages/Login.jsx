import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { FaUser, FaLock, FaCut, FaSignInAlt, FaCrown } from 'react-icons/fa';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/users');
            const users = response.data;
            const foundUser = users.find(
                (u) => u.username === username && u.password === password
            );

            if (foundUser) {
                localStorage.setItem('user', JSON.stringify(foundUser));
                setTimeout(() => navigate('/dashboard'), 1000);
            } else {
                setError('Tài khoản hoặc mật khẩu không chính xác!');
                setLoading(false);
            }
        } catch (err) {
            setError('Lỗi kết nối máy chủ!');
            setLoading(false);
        }
    };

    return (
        <div className="login-ultimate-container">
            <Row className="g-0 vh-100">
                {/* BÊN TRÁI: GIỮ NGUYÊN HÌNH ẢNH THƯƠNG HIỆU */}
                <Col lg={7} className="d-none d-lg-flex flex-column justify-content-center align-items-center position-relative overflow-hidden branding-side">
                    <div className="overlay-dark"></div>
                    <div className="branding-content text-center position-relative">
                        <div className="floating-scissors">
                            <FaCut size={120} className="text-warning opacity-25" />
                        </div>
                        <h1 className="display-1 fw-black text-white tracking-tighter mb-0">
                            BARBER<span className="text-warning text-glow-gold">SHOP</span>
                        </h1>
                        <p className="text-white-50 fs-4 fw-light letter-spacing-10">THE ART OF GROOMING</p>
                    </div>
                    <div className="light-streak streak-1"></div>
                    <div className="light-streak streak-2"></div>
                </Col>

                {/* BÊN PHẢI: LOGIN SIDE VỚI NỀN ĐEN VÀNG GRADIENT ĐẲNG CẤP */}
                <Col lg={5} className="d-flex justify-content-center align-items-center login-side-premium">
                    <div className="led-box-wrapper shadow-2xl">
                        {/* Viền LED chạy rực rỡ */}
                        <div className="led-runner"></div>
                        
                        <Card className="login-card-premium border-0 p-4">
                            <Card.Body>
                                <div className="text-center mb-5">
                                    <FaCrown className="text-warning mb-3 crown-pulse" size={40} />
                                    <h2 className="text-white fw-bold text-uppercase tracking-widest">Admin Login</h2>
                                    <div className="gold-line-shimmer mx-auto"></div>
                                </div>

                                {error && (
                                    <Alert variant="danger" className="bg-danger bg-opacity-10 border-0 text-danger text-center small py-2 mb-4 animate-shake">
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleLogin}>
                                    <div className="input-master-style mb-4">
                                        <FaUser className="master-icon" />
                                        <input 
                                            type="text" 
                                            placeholder="Tên đăng nhập"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                        <span className="focus-border"></span>
                                    </div>

                                    <div className="input-master-style mb-5">
                                        <FaLock className="master-icon" />
                                        <input 
                                            type="password" 
                                            placeholder="Mật khẩu"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <span className="focus-border"></span>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-100 py-3 fw-bold login-btn-supreme"
                                        disabled={loading}
                                    >
                                        {loading ? <Spinner size="sm" animation="border" /> : 'ĐĂNG NHẬP NGAY'}
                                    </Button>
                                </Form>

                                <div className="text-center mt-5">
                                    <span className="text-white-50 extra-small tracking-widest opacity-30">© 2026 BARBER PRO SYSTEM - V 2.0</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;700;900&display=swap');

                .login-ultimate-container {
                    font-family: 'Montserrat', sans-serif;
                    background-color: #000;
                    overflow: hidden;
                }

                /* Branding Side (Trái) */
                .branding-side {
                    background: url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop') no-repeat center center;
                    background-size: cover;
                }
                .overlay-dark {
                    position: absolute; top:0; left:0; width:100%; height:100%;
                    background: linear-gradient(45deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 100%);
                }

                /* LOGIN SIDE - NỀN ĐEN VÀNG GRADIENT ĐẲNG CẤP */
                .login-side-premium {
                    background: radial-gradient(circle at center, #1a1608 0%, #000000 100%);
                    position: relative;
                }

                /* LED BOX WRAPPER */
                .led-box-wrapper {
                    position: relative;
                    width: 440px;
                    padding: 4px; 
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 40px;
                    overflow: hidden;
                }

                .led-runner {
                    position: absolute;
                    top: -50%; left: -50%;
                    width: 200%; height: 200%;
                    background: conic-gradient(transparent, #ffc107, #fff, #ffc107, transparent 20%);
                    animation: rotate-led 3s linear infinite;
                    z-index: 1;
                }

                @keyframes rotate-led { 100% { transform: rotate(1turn); } }

                .login-card-premium {
                    background: #0d0d0d !important; 
                    border-radius: 36px !important;
                    position: relative;
                    z-index: 2;
                }

                /* HỆ THỐNG INPUT MASTER */
                .input-master-style {
                    position: relative;
                    border-bottom: 2px solid #222;
                    transition: 0.4s;
                    padding: 10px 0;
                }
                .input-master-style .master-icon {
                    position: absolute; left: 0; top: 15px;
                    color: #ffc107; opacity: 0.5; transition: 0.3s;
                }
                .input-master-style input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    padding: 5px 10px 5px 35px;
                    color: #fff;
                    outline: none;
                    font-size: 1.1rem;
                    font-weight: 300;
                }
                .input-master-style input::placeholder { color: #444; font-size: 0.9rem; letter-spacing: 1px; }

                /* Hiệu ứng tia sáng khi click vào ô nhập */
                .focus-border {
                    position: absolute; bottom: -2px; left: 0; width: 0; height: 2px;
                    background: linear-gradient(90deg, #ffc107, #fff, #ffc107);
                    transition: 0.6s cubic-bezier(0.8, 0, 0.2, 1);
                }
                .input-master-style:focus-within .focus-border { width: 100%; }
                .input-master-style:focus-within .master-icon { opacity: 1; transform: scale(1.1); filter: drop-shadow(0 0 5px #ffc107); }

                /* NÚT ĐĂNG NHẬP SUPREME */
                .login-btn-supreme {
                    background: #ffc107 !important;
                    color: #000 !important;
                    border: none !important;
                    border-radius: 18px !important;
                    letter-spacing: 3px;
                    font-weight: 900 !important;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 5px 20px rgba(255, 193, 7, 0.2);
                    position: relative;
                    overflow: hidden;
                }
                .login-btn-supreme:hover {
                    background: #fff !important;
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(255, 193, 7, 0.4);
                }
                .login-btn-supreme::after {
                    content: ''; position: absolute; top: -50%; left: -60%; width: 20%; height: 200%;
                    background: rgba(255,255,255,0.4); transform: rotate(30deg); transition: 0.6s;
                }
                .login-btn-supreme:hover::after { left: 120%; }

                .gold-line-shimmer {
                    width: 50px; height: 3px;
                    background: linear-gradient(90deg, #ffc107, #fff, #ffc107);
                    margin-top: 15px;
                    border-radius: 10px;
                }

                .crown-pulse { animation: pulse 2s infinite ease-in-out; filter: drop-shadow(0 0 10px rgba(255,193,7,0.4)); }
                @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                
                .text-glow-gold { text-shadow: 0 0 20px rgba(255, 193, 7, 0.5); }
                .extra-small { font-size: 0.6rem; }
                .animate-shake { animation: shake 0.3s ease-in-out; }
                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
            `}</style>
        </div>
    );
};

export default Login;