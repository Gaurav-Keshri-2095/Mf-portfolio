from typing import List, Optional
from sqlalchemy import Column, Interger, String, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    
    id = Column(Interger, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    transactions = relationship('Transaction', back_populates='user') # class name to table name
    

class Fund(Base):
    __tablename__ = 'fund'
    
    id = Column(Interger, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    ticker_symbol = Column(String, unique=True, nullable=False)
    current_nav = Column(float, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    transactions = relationship('Transaction', back_populates='fund')
    
    
class Transaction(Base):
    __tablename__ = 'transaction'
    
    id = Column(Interger, primary_key=True)
    user_id = Column(Interger, ForeignKey('user.id'), nullable=False)
    fund_id = Column(Interger, ForeignKey('fund.id'), nullable=False)
    amount_invested = Column(float, nullable=False)
    units_purchased = Column(float, nullable=False)
    
    transaction_type = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship('User', back_populates='transactions')
    fund = relationship('Fund', back_populates='transactions')