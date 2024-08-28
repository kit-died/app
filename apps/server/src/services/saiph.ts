import axios from 'axios'
import { getAccessToken } from './sirius'
import {
  BillTagDto,
  CustomerTagDto,
  ReceiptTagDto,
  SubscriptionTagDto,
} from '../dto/tag.dto'

const SAIPH_URL = process.env.SAIPH_URL || ''

export type Bill = {
  accountNumber: string;
  billAmount: string;
  billDate: string;
  billingAddress: string;
  billMonth: number;
  billNumber: string;
  billType: string;
  billYear: number;
  branchId: number;
  branchName: string;
  categoryCode: string | null;
  categoryName: string | null;
  customerId: number;
  customerName: string;
  deliveredDate: string | null;
  dueDate: string | null;
  id: number;
  phone: string | null;
  serviceId: number | null;
  serviceName: string | null;
  status: string;
  subscriptionAddress: string;
  subscriptionId: number;
  subscriptionNumber: string;
};

export type Subscription = {
  billingAddress: { property: { name: string } } | null;
  branch: { name: string };
  branchId: number;
  category: { name: string; code: string } | null;
  categoryId: number | null;
  customer: { name: string; accountNumber: string; phone: string };
  customerId: number;
  id: number;
  service: { name: string };
  serviceId: number;
  status: string;
  subscriptionAddress: { property: { name: string } } | null;
  subscriptionNumber: string;
};

export type Receipt = {
  id: number;
  payment: {
    balanceAmount: string;
    branch: { name: string } | null;
    branchId: number | null;
    carryForwardAmount: string;
    date: string;
    mode: string;
    status: string;
    tenderedAmount: string;
  };
  paymentId: number;
  receiptNumber: string;
};

export type Customer = {
  accountNumber: string;
  id: number;
  name: string;
  phone: string | null;
  status: string;
  type: string;
};

export async function getBills(query: string = ''): Promise<BillTagDto[]> {
  const token = await getAccessToken().catch(() => {
    throw new Error('Failed to get access token')
  })

  return await axios
    .get(`${SAIPH_URL}/bills/view?filter=billNumber eq ${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      return response.data.rows.map((bill: Bill) => ({
        accountNumber: bill.accountNumber,
        billAmount: bill.billAmount,
        billDate: bill.billDate,
        billingAddress: bill.billingAddress,
        billMonth: bill.billMonth,
        billNumber: bill.billNumber,
        billType: bill.billType,
        billYear: bill.billYear,
        branchId: bill.branchId,
        branchName: bill.branchName,
        categoryCode: bill.categoryCode,
        categoryName: bill.categoryName,
        customerId: bill.customerId,
        customerName: bill.customerName,
        deliveredDate: bill.deliveredDate,
        dueDate: bill.dueDate,
        id: bill.id,
        phone: bill.phone,
        serviceId: bill.serviceId,
        serviceName: bill.serviceName,
        status: bill.status,
        subscriptionAddress: bill.subscriptionAddress,
        subscriptionId: bill.subscriptionId,
        subscriptionNumber: bill.subscriptionNumber,
      }))
    })
    .catch((error) => {
      console.error(error)
      throw new Error('Failed to get bills')
    })
}

export async function getSubscriptions(
  query: string = ''
): Promise<SubscriptionTagDto[]> {
  const token = await getAccessToken().catch(() => {
    throw new Error('Failed to get access token')
  })

  return await axios
    .get(
      `${SAIPH_URL}/subscriptions?include=billingAddress.property,branch,category,customer,service,subscriptionAddress.property&filter=subscriptionNumber eq ${query}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response) => {
      return response.data.rows.map((subscription: Subscription) => ({
        billingAddress: subscription.billingAddress?.property.name,
        branchId: subscription.branchId,
        branchName: subscription.branch.name,
        caregoryCode: subscription.category?.code,
        categoryId: subscription.categoryId,
        categoryName: subscription.category?.name,
        customerAccountNumber: subscription.customer.accountNumber,
        customerId: subscription.customerId,
        customerName: subscription.customer.name,
        customerPhone: subscription.customer.phone,
        id: subscription.id,
        serviceId: subscription.serviceId,
        serviceName: subscription.service.name,
        status: subscription.status,
        subscriptionAddress: subscription.subscriptionAddress?.property.name,
        subscriptionNumber: subscription.subscriptionNumber,
      }))
    })
    .catch((error) => {
      console.error(error)
      throw new Error('Failed to get subscriptions')
    })
}

export async function getReceipts(
  query: string = ''
): Promise<ReceiptTagDto[]> {
  const token = await getAccessToken().catch(() => {
    throw new Error('Failed to get access token')
  })

  return await axios
    .get(
      `${SAIPH_URL}/receipts?include=payment.branch&filter=receiptNumber like ${query}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response) => {
      return response.data.rows.map((receipt: Receipt) => ({
        balanceAmount: receipt.payment.balanceAmount,
        branchId: receipt.payment.branchId,
        branchName: receipt.payment.branch?.name,
        carryForwardAmount: receipt.payment.carryForwardAmount,
        date: receipt.payment.date,
        id: receipt.id,
        mode: receipt.payment.mode,
        paymentId: receipt.paymentId,
        receiptNumber: receipt.receiptNumber,
        status: receipt.payment.status,
        tenderedAmount: receipt.payment.tenderedAmount,
      }))
    })
    .catch((error) => {
      console.error(error)
      throw new Error('Failed to get receipts')
    })
}

export async function getCustomers(
  query: string = ''
): Promise<CustomerTagDto[]> {
  const token = await getAccessToken().catch(() => {
    throw new Error('Failed to get access token')
  })

  return await axios
    .get(
      `${SAIPH_URL}/customers?filter=(accountNumber eq ${query}||name like ${query})`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response) => {
      return response.data.rows.map((customer: Customer) => ({
        accountNumber: customer.accountNumber,
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        status: customer.status,
        type: customer.type,
      }))
    })
    .catch((error) => {
      console.error(error)
      throw new Error('Failed to get customers')
    })
}
