from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship('Transaction', back_populates='user')


class Fund(Base):
    __tablename__ = 'fund'

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    ticker_symbol = Column(String, unique=True, nullable=False)
    current_nav = Column(Float, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow)

    transactions = relationship('Transaction', back_populates='fund')


class Transaction(Base):
    __tablename__ = 'transaction'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    fund_id = Column(Integer, ForeignKey('fund.id'), nullable=False)
    amount_invested = Column(Float, nullable=False)
    units_purchased = Column(Float, nullable=False)

    transaction_type = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship('User', back_populates='transactions')
    fund = relationship('Fund', back_populates='transactions')